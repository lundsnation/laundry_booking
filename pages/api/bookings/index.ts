import { NextApiRequest, NextApiResponse } from "next"
import { connect } from "../../../utils/connection"
import { logRequest } from "../../../utils/backendLogger"
import { ResponseFuncs, ERROR_MSG } from "../../../utils/types"
import Booking from '../../../models/Booking'
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0"
import { getUsers } from '../../../utils/getAuth0Users'
import { pusherBackend } from "../../../utils/pusherAPI"

const pusher = pusherBackend();

const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
  const session = await getSession(req, res)
  const user = session?.user
  const catcher = (error: Error) => res.status(400).json({ error : ERROR_MSG.GENERAL})
  await connect()

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      logRequest('GET');
      res.status(200).json(await Booking.find({}).catch(catcher))
    },

    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      logRequest('POST');
      const { date, timeSlot, userName, createdAt } = req.body

      // Initial  check if booking-request is in the past => invalid
      if (new Date(date).getTime() < Date.now()) {
        return res.status(400).json({ error: ERROR_MSG.SLOTINPAST })
      }
      // Fetching allowed slots from active user session. If undefined, defaults to 1
      const allowedSlots = user?.app_metadata.allowedSlots || 1
      // Fetching slots already booked by the user
      const slotCheck = await Booking.find({userName: user?.name, date: {$gte: new Date()}})
      if (!slotCheck || slotCheck.length < allowedSlots) {
        const json = await Booking.create(req.body).catch(catcher)
        await pusher.trigger('bookingUpdates', 'bookingUpdate', {userName,date,timeSlot,request: 'POST'})
        return res.status(201).json(json)
        
      }
      return res.status(400).json({ error: ERROR_MSG.TOOMANYSLOTS })

    },
  }

  const response = handleCase[method]
  if (response) return response(req, res)
  else return res.status(400).json({ error: ERROR_MSG.NOAPIRESPONSE })
});

export default handler