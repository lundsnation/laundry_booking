import {NextApiRequest, NextApiResponse} from "next"
import {withApiAuthRequired, getSession} from '@auth0/nextjs-auth0';
import HttpError from "../../../src/backend/errors/HttpError";
import withErrorHandler from "../../../src/backend/errors/withErrorHandler";
import UserService from "../../../src/backend/services/UserService";

const userService = new UserService()
const handler = withApiAuthRequired(withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const userSession = await getSession(req, res)
    const id: string = req.query.id as string

    //Guard clause to prevent non-admins from accessing this endpoint
    if (!userSession) {
        throw new HttpError(HttpError.StatusCode.UNAUTHORIZED, "Not authorized")
    }

    if (!userSession.user.app_metadata.roles.includes("admin")) {
        throw new HttpError(HttpError.StatusCode.UNAUTHORIZED, "Not authorized")
    }

    switch (req.method) {
        case 'GET':
            const user = await userService.getUserById(id)
            return res.status(200).json(user)
        case 'PATCH':
            const modification = req.body
            const patchedUser = await userService.patchUser(id, modification)
            return res.status(200).json(patchedUser)

        case 'DELETE':
            await userService.deleteUser(id)
            return res.status(200).json({message: "User deleted"})
        default:
            throw new HttpError(HttpError.StatusCode.NOT_FOUND, "Request method not found")
    }
}));

export default handler