import { NextApiRequest, NextApiResponse } from "next"
import { logRequest } from "../../../utils/backendLogger"
import { ResponseFuncs } from "../../../utils/types"
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getUsers } from '../../../utils/getAuth0Users'

const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
  const catcher = (error: Error) => res.status(400).json({ error })
  const userFetcher = new getUsers()
  // Request is user.name (*/api/user/NH1111 for example)
  const id: string = req.query.id as string

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      logRequest('GET_USER')
      const result = await userFetcher.getUser("name",id)?.catch(catcher)
      res.json(result)
    },
    PATCH: async (req: NextApiRequest, res: NextApiResponse) => {
      const userSession = await getSession(req,res)
      // Allows partial modification of data if admin or users own account
      if(userSession?.user.app_metadata.roles.indexOf("admin")>-1||userSession?.user.id == id){
        const modification = req.body
        logRequest('PATCH_USERS')
        const result = await userFetcher.modifyUser(modification, id).catch(catcher)
        res.send(result)
      }else{
        res.status(401).json({error:"Not Authorized"})
      }
      
    },
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      const userSession = await getSession(req,res)
      if(userSession?.user.app_metadata.roles.indexOf("admin")>-1){
        logRequest('DELETE_USER')
        const result = await userFetcher.deleteUser(id).catch(catcher)
        res.send(result)
      }else{
        res.status(401).json({error: "Not Authorized"}) 
      }
    },
  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) return response(req, res)
  else return res.status(400).json({ error: "No Response for This Request" })
});

export default handler