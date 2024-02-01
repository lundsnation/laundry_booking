import Booking from "../src/classes/Booking";
import {JsonBooking} from "../src/classes/Booking";
import User from "../src/classes/User";

class BookingsUtil {
    static fromJSON(jsonBookings: JsonBooking[]): Booking[] {
        return jsonBookings.map((jsonBooking: JsonBooking) => new Booking(jsonBooking));
    }

    static getBookingsByDate(bookings: Booking[], date: Date): Booking[] {
        return bookings.filter((booking: Booking) => booking.isSameDay(date));
    }

    static countBookingsForDay(bookings: Booking[], day: Date): number {
        return bookings.reduce((count, booking) => {
            return booking.isSameDay(day) ? count + 1 : count;
        }, 0);
    }


}

export default BookingsUtil;
