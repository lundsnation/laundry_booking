import {NextApiRequest, NextApiResponse} from "next"
import {connect} from "../../../src/backend/mongoose/connection"
import {withApiAuthRequired, getSession} from '@auth0/nextjs-auth0';
import withErrorHandler from "../../../src/backend/errors/withErrorHandler";
import HttpError from "../../../src/backend/errors/HttpError";
import BookingService from "../../../src/backend/services/BookingService";

const bookingService = new BookingService();
const handler = withApiAuthRequired(withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession(req, res)
    if (!session) {
        throw new HttpError(HttpError.StatusCode.UNAUTHORIZED, "Unauthorized")
    }
    //Type needs to be solved here
    const bookingId: string = req.query.id as string

    // connect to database
    await connect()
    switch (req.method) {
        case 'GET':
            const booking = await bookingService.getBookingById(bookingId)
            return res.status(200).json(booking)

        default:
            throw new HttpError(HttpError.StatusCode.NOT_FOUND, "Request method not found")
    }
}));

export default handler