import { NextApiRequest, NextApiResponse } from "next"
import { connect } from "../../../utils/connection"
import { logRequest } from "../../../utils/backendLogger"
import { ResponseFuncs } from "../../../utils/types"
import Booking from '../../../models/Booking'
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0"
import { getUsers} from '../../../src/getAuth0Users'

//add withApiAuthRequired
const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
  const session = getSession(req, res);
  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })
  await connect()
  console.log(session?.user)

  
  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      logRequest('GET');
      res.status(200).json(await Booking.find({}).catch(catcher))

    },
    // RESPONSE POST REQUESTS
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const userFinder = new getUsers()
      const { userName, date, timeSlot} = req.body  
      const fetchAllowedSlots = await userFinder.getUser("name",userName)
      const allowedSlots = fetchAllowedSlots.app_metadata.allowedSlots
      const slotCheck = await Booking.find({userName:userName}).catch(catcher)
      console.log(allowedSlots)
      logRequest('POST');
      if(!slotCheck || slotCheck.length < allowedSlots){
        return res.status(201).json(await Booking.create(req.body).catch(catcher))
      }
      return res.status(400).json({error: "User has max number of slots booked"})
    },
  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) return response(req, res)
  else return res.status(400).json({ error: "No Response for This Request" })
});

export default handler