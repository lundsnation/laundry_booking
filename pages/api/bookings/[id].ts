import { NextApiRequest, NextApiResponse } from "next"
import { connect } from "../../../utils/connection"
import { logRequest } from "../../../utils/backendLogger"
import { ResponseFuncs } from "../../../utils/types"
import Booking from '../../../models/Booking'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { pusherBackend } from '../../../utils/pusherAPI'

const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
  const catcher = (error: Error) => res.status(400).json({ error })
  const session = await getSession(req, res)
  const user = session?.user.name
  
  // GRAB ID FROM req.query (where next stores params)
  const id: string = req.query.id as string
  // connect to database
  await connect()

  // Potential Responses for /Bookings/:id
  const handleCase: ResponseFuncs = {

    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      logRequest('GET_ID')
      res.json(await Booking.findById(id).catch(catcher))
    },
    // RESPONSE PUT REQUESTS
    // TODO, what is this for
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      logRequest('PUT')
      res.json(await Booking.findByIdAndUpdate(id, req.body, { new: true }).catch(catcher))
    },
    // RESPONSE FOR DELETE REQUESTS WITH VALIDATION, CONFINED TO USER IN ACTIVE SESSION
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      const query = await Booking.find({ _id: id, userName: user }).catch(catcher)
      if (!query) {
        res.status(400).send({ error: 'No bookings for active user' })
      } else {
        const { userName, date, timeSlot } = req.body
        const json = await Booking.findByIdAndRemove(id).catch(catcher)
        
        await pusherBackend.trigger('bookingUpdates', 'bookingUpdate', {
          userName,
          date,
          timeSlot,
          request: 'delete'
        })

        res.status(200).json(json)
      }
      logRequest('DELETE')
    },
  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) return response(req, res)
  else return res.status(400).json({ error: "No Response for This Request" })
});

export default handler