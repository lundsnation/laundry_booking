import { NextApiRequest, NextApiResponse } from "next"
import { connect } from "../../../utils/connection"
import { logRequest } from "../../../utils/backendLogger"
import { ResponseFuncs } from "../../../utils/types"
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getUsers } from '../../../utils/getAuth0Users'

const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
  const catcher = (error: Error) => res.status(400).json({ error })
  const session = getSession(req, res)
  const userFetcher = new getUsers()
  // GRAB ID FROM req.query. ID will be desired username.
  const id: string = req.query.id as string
  // connect to database
  await connect()


  // Potential Responses for /Bookings/:id
  const handleCase: ResponseFuncs = {
    
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      logRequest('GET_USER')
      const result = await userFetcher.getUser("name",id)
      res.json(result)
    },
  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) return response(req, res)
  else return res.status(400).json({ error: "No Response for This Request" })
});

export default handler