import Booking from "../../classes/Booking";
import {Claims} from "@auth0/nextjs-auth0";
import {IBooking} from "../mongooseModels/Booking";

interface IBookingService {

    //We technicly don't return Booking[], rather what is returned from the database
    //getBookingById(id: number): Promise<Booking>;

    //getBookings(): Promise<Booking[]>;

    getBookingsByBuildingAndPostDate(building: string, date: Date): Promise<Booking[]>;

    createBooking(user: Claims, booking: IBooking): Promise<Booking>;

    //updateBooking(id: number, booking: Booking): Promise<Booking>;

    //deleteBooking(id: number): Promise<Booking>;
}

export default IBookingService;