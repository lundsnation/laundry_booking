import {NextApiRequest, NextApiResponse} from "next"
import {connect} from "../../../utils/connection"
import {logRequest} from "../../../utils/backendLogger"
import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0"
import {getBuilding} from "../../../utils/helperFunctions"
import BookingService from "../../../src/backend/services/BookingService";
import withErrorHandler from "../../../src/backend/errors/withErrorHandler";
import HttpError from "../../../src/backend/errors/HttpError";

const bookingService = new BookingService();
const handler = withApiAuthRequired(withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession(req, res)

    if (!session) {
        throw new HttpError(HttpError.StatusCode.UNAUTHORIZED, "Unauthorized")
    }

    const user = session.user

    await connect()
    switch (req.method) {
        case 'GET':
            const twoDaysAgo = new Date(new Date().setDate(new Date().getDate() - 2));
            const bookings = await bookingService.getBookingsByBuildingAndPostDate(getBuilding(user.name), twoDaysAgo);
            return res.status(200).json(bookings)

        case 'POST':
            //Do we have to check if the user is trying to book for himself or someone else?
            const booking = await bookingService.createBooking(user, req.body);
            return res.status(200).json(booking)

        default:
            return res.status(405).json({error: "Http method not allowed"})
    }
}));

export default handler