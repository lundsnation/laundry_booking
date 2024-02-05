import { NextApiRequest, NextApiResponse } from "next"
import { logRequest } from "../../../utils/backendLogger"
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getUsers } from '../../../utils/getAuth0Users'
import Auth0 from "../../../src/classes/Auth0";
import { Axios, AxiosResponse } from "axios";
import HttpError from "../../../src/backend/errors/HttpError";
import withErrorHandler from "../../../src/backend/errors/withErrorHandler";
import UserService from "../../../src/backend/services/UserService";
import Auth0API from "../../../src/apiHandlers/Auth0API";

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
            const user = await Auth0API.getUser(id)
            return res.status(200).json(user)
        case 'PATCH':
            const modification = req.body
            const response = await Auth0.patchUser(id, modification)
            if (response?.statusText === "OK") {
                return res.status(200).json({ message: "User updated" })
            }
            break
        case 'DELETE':
            const response = await Auth0API.deleteUser(id)
            if (response?.status === 204) {
                res.status(200).json({ message: "User deleted" }) //får konstigt meddelande if res.status(204) så skickar 200 istället
                return
            } else {
                res.status(500).json({ error: "Kunde inte ta bort användaren" })
            }
            break
        default:
            throw new HttpError(HttpError.StatusCode.NOT_FOUND, "Request method not found")
    }

}));

export default handler