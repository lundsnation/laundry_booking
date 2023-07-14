import { NextApiRequest, NextApiResponse } from "next"
import { logRequest } from "../../../utils/backendLogger"
import { ERROR_MSG, ResponseFuncs } from "../../../utils/types"
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getUsers } from '../../../utils/getAuth0Users'
import Auth0 from "../../../src/classes/Auth0";
import { Axios, AxiosResponse } from "axios";

const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
    const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
    const catcher = (error: Error) => res.status(400).json({ error: ERROR_MSG.GENERAL })
    const userFetcher = new getUsers()
    // Request is user.name (*/api/user/NH1111 for example)
    const userSession = await getSession(req, res)
    const id: string = req.query.id as string

    //Guard clause to prevent non-admins from accessing this endpoint
    if (userSession?.user.app_metadata.roles.indexOf("admin") > -1) {
        return res.status(401).json({ error: ERROR_MSG.NOTAUTHORIZED })
    }

    const handleCase: ResponseFuncs = {
        GET: async (req: NextApiRequest, res: NextApiResponse) => {
            logRequest('GET_USER')

            const response = await Auth0.getUser(id).catch(catcher) as AxiosResponse //Vet ej varför detta behövs. Det borde vara en axiosResponse som returneras.
            if (response.statusText === "OK") {
                res.status(200).json(response.data)
            } else {
                res.status(500).json({ error: "Kunde inte hämta användaren" })
            }


        },
        PATCH: async (req: NextApiRequest, res: NextApiResponse) => {
            logRequest('PATCH_USERS')
            const userSession = await getSession(req, res)
            // Allows partial modification of data if admin or users own account
            const modification = req.body
            const response = await Auth0.patchUser(id, modification).catch(catcher) as AxiosResponse
            if (response.statusText === "OK") {
                //Kan skicka den patchade avändaren här men bör ej behövas
                res.status(200).json({ message: "User updated" })
                return
            }
            res.status(500).json({ error: ERROR_MSG.AUTH0RESPONSEERROR })
        },
        DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
            const response = await Auth0.deleteUser(id).catch(catcher) as AxiosResponse
            if (response.statusText === "OK") {
                res.status(200).json({ message: "User deleted" })
                return
            } else {
                res.status(500).json({ error: "Kunde inte ta bort användaren" })
            }
        },
    }

    // Check if there is a response for the particular method, if so invoke it, if not response with an error
    const response = handleCase[method]
    if (response) return response(req, res)
    else return res.status(400).json({ error: ERROR_MSG.NOAPIRESPONSE })
});

export default handler