import { NextApiRequest, NextApiResponse } from "next"
import { logRequest } from "../../../utils/backendLogger"
import { ERROR_MSG, ResponseFuncs } from "../../../utils/types"
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getUsers } from '../../../utils/getAuth0Users'
import User from "../../../src/classes/User";
import { Users } from "../../../src/classes/Users";

//Redo of /api/user, this is /api/users (notice the "s") 

const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
    const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
    const catcher = (error: Error) => res.status(400).json({ error: ERROR_MSG.GENERAL })
    const session = await getSession(req, res)
    const user = session?.user.name

    // Request is user.name (*/api/user/NH1111 for example)
    const id: string = req.query.id as string
    console.log(id)

    //TODO: Add cases in logRequest

    const handleCase: ResponseFuncs = {
        GET: async (req: NextApiRequest, res: NextApiResponse) => {
            logRequest('GET_USER')
            const url = "https://lundsnation.eu.auth0.com/api/v2/users?"
            const token = await fetch("../auth/index.ts")
            const options = {
                method: 'GET',
                url: url + "q=name:" + id,
                headers: { authorization: "Bearer " + token }
            }

            const result = await fetch(url, options)
            if (result?.ok) {
                res.status(200).json(result)
                return
            }
            res.status(500).json({ error: ERROR_MSG.AUTH0RESPONSEERROR })

        },

        PATCH: async (req: NextApiRequest, res: NextApiResponse) => {
            logRequest('PATCH_USERS')
            const url = "https://lundsnation.eu.auth0.com/api/v2/" + id
            const userSession = await getSession(req, res)




            // Allows partial modification of data if admin or users own account
            if (userSession?.user.app_metadata.roles.indexOf("admin") > -1 || userSession?.user.id == id) {
                const token = await fetch("../auth/index.ts")
                const modification = req.body
                const options = {
                    method: 'PATCH',
                    url: url,
                    headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
                    body: JSON.stringify(modification)
                }
                const result = await fetch(url, options)

                if (result?.ok) {
                    res.status(200).json(result)
                    return
                }
                res.status(500).json({ error: ERROR_MSG.AUTH0RESPONSEERROR })

            } else {
                res.status(403).json({ error: ERROR_MSG.NOTAUTHORIZED })
            }
        },



        DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
            logRequest('DELETE_USER')
            const url = "https://lundsnation.eu.auth0.com/api/v2/users/" + id
            const userSession = await getSession(req, res)

            if (userSession?.user.app_metadata.roles.indexOf("admin") > -1) {
                const token = await fetch("../auth/index.ts")
                const options = {
                    method: 'DELETE',
                    url: url,
                    headers: { authorization: 'Bearer ' + token }
                }

                const result = await fetch(url, options)
                if (result?.ok) {
                    res.status(200).json(result)
                    return
                } else {
                    res.status(500).json({ error: ERROR_MSG.AUTH0RESPONSEERROR })
                }
            } else {
                res.status(403).json({ error: ERROR_MSG.NOTAUTHORIZED })
            }


        }
    }
    const response = handleCase[method]
    if (response) return response(req, res)
    else return res.status(400).json({ error: ERROR_MSG.NOAPIRESPONSE })
});

export default handler

