import { NextApiRequest, NextApiResponse } from "next"
import { connect } from "../../../utils/connection"
import { logRequest } from "../../../utils/backendLogger"
import { ResponseFuncs } from "../../../utils/types"
import Booking from '../../../models/Booking'
import { withApiAuthRequired} from '@auth0/nextjs-auth0';
import {getUsers} from '../../../src/getAuth0Users'

const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })

  // GRAB ID FROM req.query (where next stores params)
  const id: string = req.query.id as string
  
  // connect to database
  await connect()


  // Potential Responses for /Bookings/:id
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
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
    // RESPONSE FOR DELETE REQUESTS WITH VALIDATION
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      const {userName} = req.body
      let query = await Booking.find({_id:id, userName:userName }).catch(catcher)
      if(!query){
        res.status(400).send({error: 'No such booking exists'})
      }else{
        res.status(200).json(await Booking.findByIdAndRemove(id).catch(catcher))
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