import Booking from "./Booking";
import {JsonBooking} from "./Booking";

class BookingsUtil {
    static fromJSON(jsonBookings: JsonBooking[]): Booking[] {
        return jsonBookings.map((jsonBooking: JsonBooking) => new Booking(jsonBooking));
    }

    static getBookingsByDate(bookings: Booking[], date: Date): Booking[] {
        return bookings.filter((booking: Booking) => booking.isSameDate(date));
    }
}

export default BookingsUtil;