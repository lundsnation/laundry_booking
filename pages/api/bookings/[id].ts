import {NextApiRequest, NextApiResponse} from "next"
import {connect} from "../../../utils/connection"
import Booking from '../../../src/backend/mongooseModels/Booking'
import {withApiAuthRequired, getSession} from '@auth0/nextjs-auth0';
import {BackendPusher} from '../../../utils/pusherApi'
import {getBuilding} from "../../../utils/helperFunctions";
import withErrorHandler from "../../../src/backend/errors/withErrorHandler";
import HttpError from "../../../src/backend/errors/HttpError";

const backendPusher = new BackendPusher();
const handler = withApiAuthRequired(withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession(req, res)
    if (!session) {
        throw new HttpError(HttpError.StatusCode.UNAUTHORIZED, "Unauthorized")
    }
    //Type needs to be solved here
    const user = session.user

    const bookingId: string = req.query.id as string

    // connect to database
    await connect()
    switch (req.method) {
        case 'GET':
            return res.json(await Booking.findById(bookingId))
        case 'DELETE':
            const queryResult = await Booking.find({_id: bookingId, userName: user.userName})
            if (!queryResult) {
                throw new HttpError(HttpError.StatusCode.NOT_FOUND, "Booking not found")
            }

            const {userName, date, timeSlot} = req.body
            const json = await Booking.findByIdAndDelete(bookingId)
            await backendPusher.bookingUpdateTrigger(getBuilding(userName), {
                userName,
                date,
                timeSlot,
                method: backendPusher.bookingUpdateMethod.DELETE
            })

            return res.status(200).json(json)

        default:
            throw new HttpError(HttpError.StatusCode.NOT_FOUND, "Request method not found")
    }
}));

export default handler