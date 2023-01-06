import { NextApiRequest, NextApiResponse } from "next"
import { logRequest } from "../../../utils/backendLogger"
import { ERROR_MSG, ResponseFuncs } from "../../../utils/types"
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getUsers } from '../../../utils/getAuth0Users'

const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
  const catcher = (error: Error) => res.status(400).json({ error:ERROR_MSG.GENERAL })
  const userFetcher = new getUsers()
  // Request is user.name (*/api/user/NH1111 for example)
  const id: string = req.query.id as string

  const handleCase: ResponseFuncs = {
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      logRequest('GET_USER')
      const result = await userFetcher.getUser("name",id)?.catch(catcher)
      res.status(200).json(result)
    },
    PATCH: async (req: NextApiRequest, res: NextApiResponse) => {
      logRequest('PATCH_USERS')
      const userSession = await getSession(req,res)
      // Allows partial modification of data if admin or users own account
      if(userSession?.user.app_metadata.roles.indexOf("admin")>-1||userSession?.user.id == id){
        const modification = req.body
        console.log(modification)
        const result = await userFetcher.modifyUser(modification, id).catch(catcher)
        console.log(await result?.json())
        if(result?.ok){
          res.status(200).json(result)
          return
        }
        res.status(500).json({error:ERROR_MSG.AUTH0RESPONSEERROR})
      }else{
        res.status(403).json({error:ERROR_MSG.NOTAUTHORIZED})
      }
      
    },
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      logRequest('DELETE_USER')
      const userSession = await getSession(req,res)
      if(userSession?.user.app_metadata.roles.indexOf("admin")>-1){
        const result = await userFetcher.deleteUser(id).catch(catcher)
        if(result?.ok){
          res.status(200).json(result)
          return
        }
        res.status(500).json({error:ERROR_MSG.AUTH0RESPONSEERROR})
      }else{
        res.status(403).json({error:ERROR_MSG.NOTAUTHORIZED}) 
      }
    },
  }

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method]
  if (response) return response(req, res)
  else return res.status(400).json({ error:ERROR_MSG.NOAPIRESPONSE })
});

export default handler