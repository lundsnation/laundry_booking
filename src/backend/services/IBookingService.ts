import {Claims} from "@auth0/nextjs-auth0";
import {BookingDocument, IBooking} from "../mongoose/MongooseBooking";

interface IBookingService {
    getBookingsByUsername(username: string): Promise<BookingDocument[]>;

    getBookingById(id: string): Promise<BookingDocument>;

    createBooking(user: Claims, booking: IBooking): Promise<BookingDocument>;

    deleteBooking(id: string, username: string): Promise<void>;

    getBookingsByBuildingAndPostDate(building: string, date: Date): Promise<BookingDocument[]>;
}

export default IBookingService;