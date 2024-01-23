import { NextApiRequest, NextApiResponse } from "next"
import { logRequest } from "../../../utils/backendLogger"
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getUsers } from '../../../utils/getAuth0Users'
import Auth0 from "../../../src/classes/Auth0";
import { Axios, AxiosResponse } from "axios";
import HttpError from "../../../src/backend/errors/HttpError";
import withErrorHandler from "../../../src/backend/errors/withErrorHandler";
import UserService from "../../../src/backend/services/UserService";

const handler = withApiAuthRequired(withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    // Request is user.name (*/api/user/NH1111 for example)
    const userSession = await getSession(req, res)
    const id: string = req.query.id as string

    //Guard clause to prevent non-admins from accessing this endpoint
    if (!userSession) {
        throw new HttpError(HttpError.StatusCode.UNAUTHORIZED, "Not authorized")
    }

    if (!userSession.user.app_metadata.roles.includes("admin")) {
        throw new HttpError(HttpError.StatusCode.FORBIDDEN, "Forbidden action")
    }

    switch (req.method) {
        case 'GET':
            const user = await UserService.getUserById(id)
            return res.status(200).json(user)

            break
        case 'PATCH':
            const modification = req.body
            const response = await Auth0.patchUser(id, modification).catch(catcher)
            if (response?.statusText === "OK") {
                res.status(200).json({ message: "User updated" })
                return
            }
            break
        case 'DELETE':
            const response = await Auth0.deleteUser(id).catch(catcher)
            if (response?.status === 204) {
                res.status(200).json({ message: "User deleted" }) //får konstigt meddelande if res.status(204) så skickar 200 istället
                return
            } else {
                res.status(500).json({ error: "Kunde inte ta bort användaren" })
            }
            break
    }

    const handleCase: ResponseFuncs = {
        GET: async (req: NextApiRequest, res: NextApiResponse) => {
            logRequest('GET_USER')

            const response = await Auth0.getUserById(id).catch(catcher) //Vet ej varför detta behövs. Det borde vara en axiosResponse som returneras.
            if (response?.statusText === "OK") {
                res.status(200).json(response.data)
                return
            }


        },
        PATCH: async (req: NextApiRequest, res: NextApiResponse) => {
            logRequest('PATCH_USERS')
            // Allows partial modification of data if admin or users own account
            const modification = req.body
            const response = await Auth0API.patchUser(id, modification).catch(catcher)
            if (response?.statusText === "OK") {
                // if (response.status === 200) {
                //Kan skicka den patchade avändaren här men bör ej behövas
                res.status(200).json({ message: "User updated" })
                return
            }
        },

        DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
            const response = await Auth0API.deleteUser(id).catch(catcher)
            if (response?.status === 204) {
                res.status(200).json({ message: "User deleted" }) //får konstigt meddelande if res.status(204) så skickar 200 istället
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
}));

export default handler