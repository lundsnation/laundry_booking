import { NextApiRequest, NextApiResponse } from "next"
import { connect } from "../../../utils/connection"
import { logRequest } from "../../../utils/backendLogger"
import { ResponseFuncs } from "../../../utils/types"
import Booking from '../../../models/Booking'
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0"
import Pusher from "pusher"

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
});

function getMonday(d : Date, weeksAhead : number) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1)+ weeksAhead*7; 
  return new Date(d.setDate(diff));
}

const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
  const session = await getSession(req, res)
  const user = session?.user
  const catcher = (error: Error) => res.status(400).json({ error })
  await connect()

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      logRequest('GET');
      res.status(200).json(await Booking.find({}).catch(catcher))
    },

    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const { date, timeSlot, createdAt } = req.body
      // Initial  check if booking-request is in the past => invalid
      if (new Date(date).getTime() < Date.now()) {
        return res.status(406).json({ error: "You cant book slots that are in the past" })
      }
      // Fetching allowed slots from active user session. If undefined, defaults to 1
      const allowedSlots = user?.app_metadata.allowedSlots || 1
      // Checks if user has a booking in selected week, if now is greater than first day in week, adjusts the interval
      // const requestDate = req.body.date as Date
      // const weekStartDate = new Date(getMonday(requestDate,0))
      // weekStartDate.setHours(0,0,0)
      // const maxDate = new Date(getMonday(requestDate,1))
      // maxDate.setHours(0,0,0)
      // const minDate = weekStartDate<new Date() ? new Date() : weekStartDate
      // const slotCheck = await Booking.find({ userName: user, date: { $gte: minDate,$lt: maxDate} }).catch(catcher)
      const slotCheck = await Booking.find({userName: user?.name, date: {$gte: new Date()}})
      if (!slotCheck || slotCheck.length < allowedSlots) {
        logRequest('POST');

        const result = res.status(201).json(await Booking.create(req.body).catch(catcher))
        const pusherRes = await pusher.trigger("laundry-RT","booking-event",req.body);
        return result 
      }
      return res.status(400).json({ error: "User has max number of slots booked" })

    },
  }

  const response = handleCase[method]
  if (response) return response(req, res)
  else return res.status(400).json({ error: "No Response for This Request" })
});

export default handler