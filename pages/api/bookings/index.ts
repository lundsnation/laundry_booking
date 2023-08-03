import { NextApiRequest, NextApiResponse } from "next"
import { connect } from "../../../utils/connection"
import { logRequest } from "../../../utils/backendLogger"
import { ResponseFuncs, ERROR_MSG, UserType } from "../../../utils/types"
import Booking from '../../../models/Booking'
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0"
import { pusherBackend } from "../../../utils/pusherAPI"
import { isValidPhoneNumber } from 'libphonenumber-js'
import User from "../../../src/classes/User"
import { getBuilding } from "../../../utils/helperFunctions"

const pusher = pusherBackend();

const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
  const session = await getSession(req, res)
  const user = session?.user

  const catcher = (error: Error) => {
    console.log(error)
    res.status(400).json({ error: ERROR_MSG.GENERAL })
  }
  await connect()

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      logRequest('GET');
      const bookingsFromLastTwoDays = await Booking.find({ date: { $gte: new Date(new Date().setDate(new Date().getDate() - 2)) } });
      if (bookingsFromLastTwoDays) {
        const buildingBookings = bookingsFromLastTwoDays.filter((booking) => {
          const userBuilding = getBuilding(user?.name)
          const bookingBuilding = getBuilding(booking.userName)
          return userBuilding === bookingBuilding
        })

        return res.status(200).json(buildingBookings)
      } else {
        return res.status(400).json({ error: ERROR_MSG.NOBOOKING })
      }
    },

    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      logRequest('POST');
      const { date, timeSlot, userName, createdAt } = req.body

      // Check too see if user has added phone Number
      const nbr = user?.user_metadata.telephone || ""
      if (!isValidPhoneNumber(nbr)) {
        return res.status(400).json({ error: ERROR_MSG.NONUMBER })
      }

      // Initial  check if booking-request is in the past => invalid
      if (new Date(date).getTime() < Date.now()) {
        return res.status(400).json({ error: ERROR_MSG.SLOTINPAST })
      }

      // Fetching allowed slots from active user session. If undefined, defaults to 1
      const allowedNumSlots = user?.app_metadata.allowedSlots || 1
      // Fetching slots already booked by the user
      const activeUserSlots = await Booking.find({ userName: user?.name, date: { $gte: new Date() } })
      if (activeUserSlots.length > allowedNumSlots) {
        return res.status(400).json({ error: ERROR_MSG.TOOMANYSLOTS })
      }

      //
      const dateBookings = await Booking.find({ date });
      const buildingBookingExists = dateBookings.some((booking) => {
        const userBuilding = getBuilding(userName)
        const bookingBuilding = getBuilding(booking.userName)
        return userBuilding === bookingBuilding
      })

      if (buildingBookingExists) {
        return res.status(400).json({ error: ERROR_MSG.ALREADY_BOOKED })
      }

      const json = await Booking.create(req.body).catch(catcher)
      await pusher.trigger('bookingUpdates', 'bookingUpdate', { userName, date, timeSlot, request: 'POST' })
      return res.status(201).json(json)
    },
  }

  const response = handleCase[method]
  if (response) return response(req, res)
  else return res.status(400).json({ error: ERROR_MSG.NOAPIRESPONSE })
});

export default handler