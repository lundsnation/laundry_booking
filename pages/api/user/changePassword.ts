import { NextApiRequest, NextApiResponse } from "next"
import { logRequest } from "../../../utils/backendLogger"
import { ERROR_MSG, ResponseFuncs } from "../../../utils/types"
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getUsers } from '../../../utils/getAuth0Users'

const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
  const catcher = (error: Error) => res.status(400).json({ error: ERROR_MSG.GENERAL })
  const userFetcher = new getUsers()
  const userSession = await getSession(req,res)
  

  const handleCase: ResponseFuncs = {
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      logRequest('USER_CHANGEPASSWORD')
      const {email} = req.body
      if(userSession?.user.email === email){
        const result = await userFetcher.changePassword(email).catch(catcher)
        res.json(result)
        return
      }
      res.status(403).json({error : ERROR_MSG.NOTAUTHORIZED})
    },
  }

  const response = handleCase[method]
  if (response) return response(req, res)
  else return res.status(400).json({ error: ERROR_MSG.NOAPIRESPONSE })
});

export default handler