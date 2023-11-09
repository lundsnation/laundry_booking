import IBookingService from "./IBookingService";
import BookingDao, {IBooking} from '../mongooseModels/Booking'
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

    async getBookingsByBuildingAndPostDate(building: string, date: Date): Promise<any> {
        const bookingsPostDate = await BookingDao.find({date: {$gte: date}});

        if (bookingsPostDate.length === 0) {
            throw new HttpError(HttpError.StatusCode.NOT_FOUND, "No bookings found");
        }

        return bookingsPostDate.filter((booking) => {
            return getBuilding(booking.userName) === building;
        });
    }

    async createBooking(user: Claims, booking: IBooking): Promise<any> {
        const nbr = user.user_metadata.telephone || ""
        //Can maybe be done in validation layer?
        if (!isValidPhoneNumber(nbr)) {
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "Invalid phone number");
        }

        // Initial  check if booking-request is in the past => invalid
        // Should be handled in validation
        if (new Date(booking.date).getTime() < Date.now()) {
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "Booking date is in the past");
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
        })

        if (buildingBookingExists) {
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "Booking for building already exists");
        }

        const json = await BookingDao.create(booking)
        await this.backendPusher.bookingUpdateTrigger(getBuilding(user.name), {
            userName: user.name,
            date: booking.date,
            timeSlot: booking.timeSlot,
            method: this.backendPusher.bookingUpdateMethod.POST
        })

        return json
    }
}

export default BookingService;