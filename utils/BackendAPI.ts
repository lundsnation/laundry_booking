import axios from "axios";
import Booking, {JsonBooking, newBooking} from "../src/classes/Booking";


class BackendAPI {
    //Might need to add error handling here
    static async fetchBooking(id: string): Promise<Booking> {
        const response = await axios.get(`/api/bookings/${id}`)
        return new Booking(response.data as JsonBooking)
    }

    static async fetchBookingsByUser(user: string): Promise<Booking[]> {
        return (await axios.get(`/api/bookings/user/${user}`)).data.map((booking: JsonBooking) => new Booking(booking))
    }

    static async postBooking(booking: newBooking) {
        return await axios.post("/api/bookings", booking)
    }

    static async deleteBooking(id: string) {
        return await axios.delete(`/api/bookings/${id}`)
    }

    static async fetchBookings(): Promise<Booking[]> {
        const response = await axios.get("/api/bookings")
        return response.data.map((booking: JsonBooking) => new Booking(booking))
    }
}

export default BackendAPI;
