import { NextApiRequest, NextApiResponse } from "next"
import { connect } from "../../../utils/connection"
import { logRequest } from "../../../utils/backendLogger"
import { ResponseFuncs } from "../../../utils/types"
import Booking from '../../../models/Booking'
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0"
import { getUsers} from '../../../src/getAuth0Users'
import Pusher from 'pusher'


const pusher = new Pusher({
  appId: "1515147",
  key: "fa569778e9e1c854bf93",
  secret: "fbb573750e39f273ac3d",
  cluster: "eu",
  encrypted: true
});


const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
  const session = getSession(req, res)
  const user = session?.user.name
  const catcher = (error: Error) => res.status(400).json({ error })
  await connect()
  
  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      logRequest('GET');
      res.status(200).json(await Booking.find({}).catch(catcher))
    },

    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const userFinder = new getUsers()
      const {date, timeSlot} = req.body  
      console.log(typeof(date))
      // Initial  check if booking-request is in the past => invalid
      if(new Date(date).getTime() < Date.now()){
        return res.status(406).json({error:"You cant book slots that are in the past"})
      }
      const fetchAllowedSlots = await userFinder.getUser("name",user)
      const allowedSlots = fetchAllowedSlots.app_metadata.allowedSlots
      const slotCheck = await Booking.find({userName:user, date: {$gte: new Date()}}).catch(catcher)
      logRequest('POST');
      // Checks if user has no bookings or have less than allowed slots already booked in DB
      if(!slotCheck || slotCheck.length < allowedSlots){
        const postReq = await Booking.create(req.body).catch(catcher)
        pusher.trigger("RTupdate", "notify", {
          message: "POST"
        });
        return res.status(201).json(postReq)
      }
      return res.status(400).json({error: "User has max number of slots booked"})
      
    },
  }

  const response = handleCase[method]
  if (response) return response(req, res)
  else return res.status(400).json({ error: "No Response for This Request" })
});

export default handler