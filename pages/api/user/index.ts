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
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      logRequest('GET_ALL_USERS')
      if(userSession?.user.app_metadata.roles.indexOf("admin")>-1){  
        const result = await userFetcher.getAllUsers()?.catch(catcher)
        res.status(200).json(result)
        return
      }
      res.status(403).json({error : ERROR_MSG.NOTAUTHORIZED})
    },
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      logRequest('POST_USERS')
      if(userSession?.user.app_metadata.roles.indexOf("admin")>-1){
        const user = req.body
        const result = await userFetcher.createUser(user).catch(catcher)
        res.status(200).json(result)
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