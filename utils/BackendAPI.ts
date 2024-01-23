import axios, { Axios } from "axios";
import Booking, { JsonBooking, newBooking } from "../src/classes/Booking";
import User, { JsonUser } from "../src/classes/User";


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

    static async getAllUsers(): Promise<User[]> {
        const response = await axios.get("/api/users")
        return response.data.map((user: JsonUser) => new User(user))
    }

    static async getUserById(id: string): Promise<User> {
        const response = await axios.get(`/api/users/${id}`)
        return new User(response.data as JsonUser)
    }

    static async getUserByName(name: string): Promise<User> {
        const response = await axios.get(`/api/users/name/${name}`)
        return new User(response.data as JsonUser)
    }
    //TODO: Evaluate if parameter type should be changed to JsonUser
    static async postUser(user: User) {
        return await axios.post("/api/users", user)
    }

    static async deleteUser(id: User) {
        return await axios.delete(`/api/users/${id}`)
    }

    static async patchUser(id: string, modification: object) {
        return await axios.patch(`/api/users/${id}`, modification)
    }

}

export default BackendAPI;

