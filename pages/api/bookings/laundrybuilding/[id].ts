import {NextApiRequest, NextApiResponse} from "next";
import HttpError from "../../../../src/backend/errors/HttpError";
import {connect} from "../../../../src/backend/mongoose/connection";
import BookingService from "../../../../src/backend/services/BookingService";
import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import withErrorHandler from "../../../../src/backend/errors/withErrorHandler";
import {LaundryBuilding} from "../../../../src/frontend/configs/Config";

const bookingService = new BookingService();

const handler = withApiAuthRequired(withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession(req, res);
    if (!session) {
        throw new HttpError(HttpError.StatusCode.UNAUTHORIZED, "Unauthorized");
    }

    await connect(); // connect to database

    if (req.method === 'GET') {
        if ('id' in req.query) {
            // Functionality for getting bookings by laundry building
            const laundryBuilding = req.query.id as LaundryBuilding;
            const bookings = await bookingService.getBookingsByLaundryBuildingAndPostDate(laundryBuilding, new Date());
            return res.status(200).json(bookings);
        } else {
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "Missing required query parameter: laundryBuilding");
        }
    } else {
        throw new HttpError(HttpError.StatusCode.NOT_FOUND, "Request method not found");
    }
}));

export default handler;
