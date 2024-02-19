import Booking from "../classes/Booking";
import {JsonBooking} from "../classes/Booking";

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
