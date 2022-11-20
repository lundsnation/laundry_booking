import { NextApiRequest, NextApiResponse } from "next"
import { connect } from "../../../utils/connection"
import { logRequest } from "../../../utils/backendLogger"
import { ResponseFuncs } from "../../../utils/types"
import Booking from '../../../models/Booking'
import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { getUsers} from '../../../src/getAuth0Users'
import { slotShouldForwardProp } from "@mui/material/styles/styled"

const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error })
  await connect()

  
  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      let query = await Booking.find({}).catch(catcher)
      res.status(200).json(query)
      logRequest('GET');
    },
    // RESPONSE POST REQUESTS WITH VALIDATION, ONLY UNIQUE DATES CAN BE ADDED AND IS SUBJECT TO ALLOWEDSLOT PROPERTY OF USER
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const {date, userName} = req.body  
      let query = await Booking.findOne({date}).catch(catcher)
      if(!query){
        // Validation, checking timeslots already booked by the user, aswell as date being unique.
        const userFinder = new getUsers()
        const fetchAllowedSlots = await userFinder.getUser("name",userName)
        if(!fetchAllowedSlots){
          res.status(400).send({error: 'User error'})
          return 
        }
        const allowedSlots = fetchAllowedSlots.app_metadata.allowedSlots
        let slotCheck = await Booking.find({userName:userName}).catch(catcher)
        if(!slotCheck || slotCheck.length < allowedSlots){
          res.status(201).json(await Booking.create(req.body).catch(catcher))
          return
        }
        res.status(400).send({ error: 'Exceeded number of allowed slots'})
      }
      else{
        res.status(400).send({ error: 'Time is already booked! '})
      }
      logRequest('POST');
      
      
    },
  }



  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) return response(req, res)
  else return res.status(400).json({ error: "No Response for This Request" })
});

export default handler