import axios from "axios";
import Booking from "./Booking";
import { JsonBooking, Building } from "../../utils/types";
import { is } from "date-fns/locale";

class Bookings {
    private bookings: Booking[] = [];

    constructor() {
        this.bookings = [];
    }

    addBooking(booking: Booking) {
        this.bookings.push(booking);
    }

    getBookings() {
        return this.bookings;
    }

    getUserBookings(userName: string): Bookings {
        return this.filter((booking) => booking.isUserBooking(userName));
    }

    getActiveUserBookings(userName: string): Bookings {
        return this.filter((booking) => {
            return booking.isUserBooking(userName) && !booking.hasPassed();
        });
    }

    getDateBookings(date: Date): Bookings {
        return this.filter((booking) => booking.isSameDate(date));
    }

    filter(predicate: (booking: Booking) => boolean): Bookings {
        const filteredBookings = new Bookings();
        filteredBookings.bookings = this.bookings.filter(predicate);
        return filteredBookings;
    }

    async fetch() {
        try {
            // Perform the Axios request to retrieve bookings from the database
            const response = await axios.get("/api/bookings");
            const data = response.data;

            // Map the retrieved data to Booking instances and update the bookings array
            this.bookings = data.map((bookingData: JsonBooking) =>
                Booking.fromJSON(bookingData)
            );
        } catch (error) {
            console.error("Error fetching bookings from the database:", error);
            // Handle the error appropriately
        }
    }

    static fromBookings(bookings: Booking[]): Bookings {
        const bookingsInstance = new Bookings();
        bookingsInstance.bookings = bookings;
        return bookingsInstance;
    }

    static fromJSON(json: JsonBooking[]): Bookings {
        const bookings = new Bookings();
        bookings.bookings = json.map((bookingData: JsonBooking) =>
            Booking.fromJSON(bookingData)
        );
        return bookings;
    }
}
