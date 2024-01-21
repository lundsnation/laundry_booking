import BookingDao, {BookingDocument, IBooking} from '../mongoose/MongooseBooking'
import HttpError from "../errors/HttpError";
import {isValidPhoneNumber} from "libphonenumber-js";
import {Claims} from "@auth0/nextjs-auth0";
import {BackendPusher} from "../../apiHandlers/PusherAPI";
import {LaundryBuilding} from "../../configs/Config";
import User from "../../classes/User";

class BookingService {
    private backendPusher: BackendPusher

    constructor() {
        this.backendPusher = new BackendPusher()
    }

    async getBookingsByUsername(username: string): Promise<BookingDocument[]> {
        const bookings = await BookingDao.find({username: username});

        if (bookings.length === 0) {

            throw new HttpError(HttpError.StatusCode.NOT_FOUND, "No bookings found for user: " + username);
        }

        return bookings;
    }

    async deleteBooking(id: string, user: User): Promise<void> {
        const bookingDoc = await this.getBookingById(id);

        bookingDoc.startTime

        if (bookingDoc.username !== user.name) {
            throw new HttpError(HttpError.StatusCode.FORBIDDEN, "User does not own booking")
        }

        await BookingDao.findByIdAndDelete(id)
        await this.backendPusher.bookingUpdateTrigger(user.app_metadata.laundryBuilding, {
            username: user.name,
            startTime: bookingDoc.startTime,
            timeSlot: bookingDoc.timeSlot,
            method: this.backendPusher.bookingUpdateMethod.DELETE
        })
    }

    async getBookingById(id: string): Promise<BookingDocument> {
        const bookingDoc = await BookingDao.findById(id);

        if (!bookingDoc) {
            throw new HttpError(HttpError.StatusCode.NOT_FOUND, "MongooseBooking not found");
        }

        return bookingDoc;
    }

    async getBookingsByLaundryBuildingAndPostDate(laundryBuilding: LaundryBuilding, date: Date): Promise<BookingDocument[]> {
        console.log("laundryBuilding", laundryBuilding)
        console.log("date", date)
        const laundryBuildingBookingsPostDate = await BookingDao.findBookingsByLaundryBuildingAndPostDate(laundryBuilding, date);
        console.log("bookingsPostDate", laundryBuildingBookingsPostDate)

        if (laundryBuildingBookingsPostDate.length === 0) {
            throw new HttpError(HttpError.StatusCode.NOT_FOUND, "No bookings found");
        }

        return laundryBuildingBookingsPostDate

    }

    async createBooking(user: Claims, booking: IBooking): Promise<BookingDocument> {
        const nbr = user.user_metadata.telephone || ""

        //Can maybe be done in validation layer?
        if (!isValidPhoneNumber(nbr)) {
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "Invalid phone number");
        }

        // Should be handled in validation
        if (new Date(booking.startTime).getTime() < Date.now()) {
            console.log("MongooseBooking date is in the past", booking.startTime, Date.now())
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "MongooseBooking date is in the past");
        }

        const allowedNumBookings = user.app_metadata.allowedSlots || 1
        const activeBookings = await BookingDao.find({userName: user.name, date: {$gte: new Date()}})

        if (activeBookings.length > allowedNumBookings) {
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "Too many slots booked");
        }

        const dateBookings = await BookingDao.find({date: booking.startTime});
        const buildingBookingExists = dateBookings.some((booking) => {
            const userBuilding = user.laundryBuilding
            const bookingBuilding = booking.laundryBuilding
            return userBuilding === bookingBuilding
        });

        if (buildingBookingExists) {
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "MongooseBooking for building already exists");
        }

        //Type should be changed to IBookingDocument
        const bookingDoc: BookingDocument = await BookingDao.create(booking);

        await this.backendPusher.bookingUpdateTrigger(user.app_metadata.laundryBuilding, {
            username: user.name,
            startTime: booking.startTime,
            timeSlot: booking.timeSlot,
            method: this.backendPusher.bookingUpdateMethod.POST
        })

        return bookingDoc
    }
}

export default BookingService;