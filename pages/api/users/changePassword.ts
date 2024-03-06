import {NextApiRequest, NextApiResponse} from "next";
import {withApiAuthRequired, getSession} from '@auth0/nextjs-auth0';
import HttpError from "../../../src/backend/errors/HttpError";
import withErrorHandler from "../../../src/backend/errors/withErrorHandler";
import UserService from "../../../src/backend/services/UserService";

const userService = new UserService();
const handler = withApiAuthRequired(withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const userSession = await getSession(req, res);

    if (!userSession) {
        throw new HttpError(HttpError.StatusCode.UNAUTHORIZED, "Not authorized");
    }

    switch (req.method) {
        case 'POST':
            const {email} = req.body;
            if (!(userSession.user.email === email || userSession.user.app_metadata.roles.includes("admin"))) {
                throw new HttpError(HttpError.StatusCode.FORBIDDEN, "Forbidden action");
            }
            const response = await userService.changePasswordByEmail(email);
            return res.status(200).json(response);

        default:
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "Request method not found");
    }
}));

export default handler;
