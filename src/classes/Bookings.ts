import axios from "axios";
import Booking from "./Booking";
import {JsonBooking} from "../../utils/types";

class Bookings {
    private bookings: Booking[] = [];

    constructor() {
        this.bookings = [];
    }

    length(): number {
        return this.bookings.length;
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

    map(callback: (booking: Booking, index: number, array: Booking[]) => any): any[] {
        return this.bookings.map(callback);
    }

    forEach(callback: (booking: Booking, index: number, array: Booking[]) => void): void {
        this.bookings.forEach(callback);
    }

    find(predicate: (booking: Booking) => boolean): Booking | undefined {
        return this.bookings.find(predicate);
    }


    static async fetch(): Promise<Bookings> {
        try {
            // Perform the Axios request to retrieve bookings from the database
            const response = await axios.get("/api/bookings");
            const data = response.data;

            // Create a new instance of Bookings
            const bookings = new Bookings();

            // Map the retrieved data to MongooseBooking instances and update the bookings array
            bookings.bookings = data.map((bookingData: JsonBooking) =>
                Booking.fromJSON(bookingData)
            );

            // Return the populated Bookings instance
            return bookings;
        } catch (error) {
            console.error("Error fetching bookings from the database:", error);
            // Handle the error appropriately
            throw error;
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

export default Bookings;