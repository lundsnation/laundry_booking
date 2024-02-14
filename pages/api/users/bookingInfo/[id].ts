import {NextApiRequest, NextApiResponse} from "next"
import {withApiAuthRequired, getSession} from '@auth0/nextjs-auth0';
import UserService from "../../../../src/backend/services/UserService";
import HttpError from "../../../../src/backend/errors/HttpError";
import withErrorHandler from "../../../../src/backend/errors/withErrorHandler";


const userService = new UserService()
const handler = withApiAuthRequired(withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    // Request is user.name (*/api/user/NH1111 for example)
    const userSession = await getSession(req, res)
    const id: string = req.query.id as string

    //Guard clause to prevent non-admins from accessing this endpoint
    if (!userSession) {
        throw new HttpError(HttpError.StatusCode.UNAUTHORIZED, "Not authorized")
    }

    switch (req.method) {
        case 'GET':
            const user = await userService.getUserBookingInfo(id)
            return res.status(200).json(user)
        default:
            throw new HttpError(HttpError.StatusCode.NOT_FOUND, "Request method not found")
    }
}));

export default handler