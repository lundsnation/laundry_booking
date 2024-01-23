import { NextApiRequest, NextApiResponse } from "next"
import { logRequest } from "../../../utils/backendLogger"
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getUsers } from '../../../utils/getAuth0Users'
import Auth0 from "../../../src/classes/Auth0";
import UserService from "../../../src/backend/services/UserService";
import { AxiosResponse } from "axios";
import HttpError from "../../../src/backend/errors/HttpError";
import withErrorHandler from "../../../src/backend/errors/withErrorHandler";


const userService = new UserService()
const handler = withApiAuthRequired(withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const userSession = await getSession(req, res)

    if (!userSession) {
        throw new HttpError(HttpError.StatusCode.UNAUTHORIZED, "Not authorized")
    }

    if (!userSession.user.app_metadata.roles.includes("admin")) {
        throw new HttpError(HttpError.StatusCode.FORBIDDEN, "Forbidden action")
    }

    switch (req.method) {
        case 'GET':
            const users = await userService.getAllUsers()
            return res.status(200).json(users)

        case 'POST':
            const response = await userService.createUser(req.body)
            return res.status(200).json(response)
    }
}));

export default handler;
