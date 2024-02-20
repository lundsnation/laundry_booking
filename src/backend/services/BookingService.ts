import BookingDao, {BookingDocument} from '../mongoose/MongooseBooking'
import HttpError from "../errors/HttpError";
import {isValidPhoneNumber} from "libphonenumber-js";
import {Claims} from "@auth0/nextjs-auth0";
import {BackendPusher} from "../../apiHandlers/PusherAPI";
import {LaundryBuilding} from "../../frontend/configs/Config";
import User from "../../frontend/models/User";
import {JsonBooking} from "../../frontend/models/Booking";

class BookingService {
    private backendPusher: BackendPusher

    constructor() {
        this.backendPusher = new BackendPusher()
    }

    async getBookingsByUsername(username: string): Promise<BookingDocument[]> {
        return BookingDao.find({username: username});
    }

    async deleteBooking(id: string, user: User): Promise<void> {
        const bookingDoc = await this.getBookingById(id);

        if (bookingDoc.username !== user.name && !user.app_metadata.roles.includes("admin")) {
            throw new HttpError(HttpError.StatusCode.FORBIDDEN, "User does not own booking or is not admin");
        }

        await BookingDao.findByIdAndDelete(id)
        await this.backendPusher.bookingUpdateTrigger(bookingDoc.laundryBuilding as LaundryBuilding, {
            username: user.name,
            startTime: bookingDoc.startTime.toISOString(),
            timeSlot: bookingDoc.timeSlot,
            method: this.backendPusher.bookingUpdateMethod.DELETE
        })
    }

    async getBookingById(id: string): Promise<BookingDocument> {
        const bookingDoc = await BookingDao.findById(id);

        if (!bookingDoc) {
            throw new HttpError(HttpError.StatusCode.NOT_FOUND, "Booking not found");
        }

        return bookingDoc;
    }

    async getBookingsByLaundryBuildingAndPostDate(laundryBuilding: LaundryBuilding, date: Date): Promise<BookingDocument[]> {
        return await BookingDao.findBookingsByLaundryBuildingAndPostDate(laundryBuilding, date);

    }

    async createBooking(user: Claims, booking: JsonBooking): Promise<BookingDocument> {
        const nbr = user.user_metadata.telephone || ""

        //Can maybe be done in validation layer?
        if (!isValidPhoneNumber(nbr)) {
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "Invalid phone number");
        }

        // Should be handled in validation
        if (new Date(booking.startTime).getTime() < Date.now()) {
            console.log("MongooseBooking date is in the past", booking.startTime, Date.now())
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "Booking date is in the past");
        }

        const allowedNumBookings = user.app_metadata.allowedSlots || 1
        const activeBookings = await BookingDao.find({userName: user.name, date: {$gte: new Date()}})

        if (activeBookings.length > allowedNumBookings) {
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "Too many slots booked");
        }

        if (!(user.app_metadata.roles.includes("admin")) && booking.laundryBuilding !== user.app_metadata.laundryBuilding) {
            throw new HttpError(HttpError.StatusCode.FORBIDDEN, "Forbidden to create booking for other laundry building")
        }

        if (user.sub != booking.user_id && !user.app_metadata.roles.includes("admin")) {
            throw new HttpError(HttpError.StatusCode.UNAUTHORIZED, "Unauthorized to create bookings for other user")
        }

        //Type should be changed to IBookingDocument
        const bookingDoc: BookingDocument = await BookingDao.create(booking);

        await this.backendPusher.bookingUpdateTrigger(booking.laundryBuilding as LaundryBuilding, {
            username: user.name,
            timeSlot: booking.timeSlot,
            startTime: booking.startTime,
            method: this.backendPusher.bookingUpdateMethod.POST
        })

        return bookingDoc
    }
}

export default BookingService;