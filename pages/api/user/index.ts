import { NextApiRequest, NextApiResponse } from "next"
import { logRequest } from "../../../utils/backendLogger"
import { ResponseFuncs } from "../../../utils/types"
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getUsers } from '../../../utils/getAuth0Users'

const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
  const catcher = (error: Error) => res.status(400).json({ error })
  const userFetcher = new getUsers()

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      logRequest('GET_ALL_USERS')
      const result = await userFetcher.getAllUsers()?.catch(catcher)
      res.status(200).json(result)
    },
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      const user = req.body
      logRequest('POST_USERS')
      const result = await userFetcher.createUser(user).catch(catcher)
      res.status(200).json(result)
    },
  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) return response(req, res)
  else return res.status(400).json({ error: "No Response for This Request" })
});

export default handler