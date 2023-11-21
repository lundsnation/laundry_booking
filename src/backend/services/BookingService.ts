import IBookingService from "./IBookingService";
import BookingDao, {BookingDocument, IBooking} from '../mongooseModels/MongooseBooking'
import HttpError from "../errors/HttpError";
import {getBuilding} from "../../../utils/helperFunctions";
import {isValidPhoneNumber} from "libphonenumber-js";
import {Claims} from "@auth0/nextjs-auth0";
import {BackendPusher} from "../../../utils/pusherApi";

class BookingService implements IBookingService {
    private backendPusher: BackendPusher

    constructor() {
        this.backendPusher = new BackendPusher()
    }

    async getBookingsByUsername(username: string): Promise<BookingDocument[]> {
        const bookings = await BookingDao.find({userName: username});

        if (bookings.length === 0) {
            throw new HttpError(HttpError.StatusCode.NOT_FOUND, "No bookings found");
        }

        return bookings;
    }

    async deleteBooking(id: string, username: string): Promise<void> {
        const bookingDoc = await this.getBookingById(id);

        if (bookingDoc.userName !== username) {
            throw new HttpError(HttpError.StatusCode.FORBIDDEN, "User does not own booking")
        }

        await BookingDao.findByIdAndDelete(id)
        await this.backendPusher.bookingUpdateTrigger(getBuilding(username), {
            userName: username,
            date: bookingDoc.date,
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

    async getBookingsByBuildingAndPostDate(building: string, date: Date): Promise<BookingDocument[]> {
        const bookingsPostDate = await BookingDao.findBookingsAfterDate(date);

        if (bookingsPostDate.length === 0) {
            throw new HttpError(HttpError.StatusCode.NOT_FOUND, "No bookings found");
        }

        return bookingsPostDate.filter((booking) => {
            return booking.getBuilding() === building
        });
    }

    async createBooking(user: Claims, booking: IBooking): Promise<BookingDocument> {
        const nbr = user.user_metadata.telephone || ""
        //Can maybe be done in validation layer?
        if (!isValidPhoneNumber(nbr)) {
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "Invalid phone number");
        }

        // Initial  check if booking-request is in the past => invalid
        // Should be handled in validation
        if (new Date(booking.date).getTime() < Date.now()) {
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "MongooseBooking date is in the past");
        }

        // Fetching allowed slots from active user session. If undefined, defaults to 1
        const allowedNumSlots = user.app_metadata.allowedSlots || 1
        // Fetching slots already booked by the user
        const activeUserSlots = await BookingDao.find({userName: user.name, date: {$gte: new Date()}})

        if (activeUserSlots.length > allowedNumSlots) {
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "Too many slots booked");
        }

        const dateBookings = await BookingDao.find({date: booking.date});
        const buildingBookingExists = dateBookings.some((booking) => {
            const userBuilding = getBuilding(user.name)
            const bookingBuilding = booking.getBuilding()
            return userBuilding === bookingBuilding
        });

        if (buildingBookingExists) {
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "MongooseBooking for building already exists");
        }

        //Type should be changed to IBookingDocument
        const bookingDoc: BookingDocument = await BookingDao.create(booking);

        await this.backendPusher.bookingUpdateTrigger(getBuilding(user.name), {
            userName: user.name,
            date: booking.date,
            timeSlot: booking.timeSlot,
            method: this.backendPusher.bookingUpdateMethod.POST
        })

        return bookingDoc
    }
}

export default BookingService;