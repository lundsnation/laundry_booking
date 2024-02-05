import axios from "axios";
import Booking, { JsonBooking, NewBooking } from "../classes/Booking";
import User from "../classes/User";

class BackendAPI {
    //Might need to add error handling here
    static async fetchBooking(id: string): Promise<Booking> {
        return new Booking((await axios.get(`/api/bookings/${id}`)).data)
    }

    static async fetchBookingsByUser(username: string): Promise<Booking[]> {
        const bookings = (await axios.get(`/api/bookings?username=${username}`)).data
        return bookings.map((booking: JsonBooking) => new Booking(booking))
    }

    static async postBooking(booking: NewBooking): Promise<Booking> {
        return new Booking((await axios.post("/api/bookings", booking)).data)
    }

    static async deleteBooking(id: string) {
        return new Booking((await axios.delete(`/api/bookings/${id}`)).data)
    }

    static async fetchBookings(): Promise<Booking[]> {
        const bookings = (await axios.get("/api/bookings")).data
        return bookings.map((booking: JsonBooking) => new Booking(booking))
    }

    // ------------------ USER RELATED ------------------
    static async fetchUser(id: string): Promise<User> {
        return await axios.get("api/users/" + id)
    }
}

export default BackendAPI;
