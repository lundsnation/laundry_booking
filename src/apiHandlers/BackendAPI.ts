import axios, {AxiosResponse} from "axios";
import Booking, {JsonBooking, NewBooking} from "../frontend/classes/Booking";
import User, {JsonUser, NewUser, UserBookingInfo, UserProfileUpdate, UserUpdate} from "../frontend/classes/User";
import {LaundryBuilding} from "../frontend/configs/Config";


// This class is used to communicate with the backend API from the frontend
class BackendAPI {

    // ------------------ BOOKING API ------------------
    static async fetchBooking(id: string): Promise<Booking> {
        return new Booking((await axios.get(`/api/bookings/${id}`)).data)
    }

    static async fetchBookingsForBuilding(building: LaundryBuilding): Promise<Booking[]> {
        const bookings = (await axios.get(`/api/bookings/laundrybuilding/${building}`)).data;
        return bookings.map((booking: JsonBooking) => new Booking(booking));
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

    // ------------------ USER API ------------------
    static async fetchUser(id: string): Promise<User> {
        return new User((await axios.get("api/users/" + id)).data)
    }

    static async fetchUserBookingInfo(id: string): Promise<UserBookingInfo> {
        return (await axios.get("api/users/bookingInfo/" + id)).data
    }

    static async createUser(newUser: NewUser): Promise<User> {
        return new User((await axios.post("api/users", newUser)).data)
    }

    static async deleteUser(id: string) {
        return await axios.delete("api/users/" + id)
    }

    static async fetchUsers(): Promise<User[]> {
        const users = (await axios.get("api/users")).data
        return users.map((user: JsonUser) => new User(user))
    }

    static async patchUser(id: string, modification: UserUpdate): Promise<User> {
        return new User((await axios.patch("api/users/" + id, modification)).data)
    }

    static async updateUserProfile(profileUpdate: UserProfileUpdate): Promise<User> {
        return new User((await axios.patch("api/auth/updateProfile", profileUpdate)).data)
    }

    static async acceptTerms(): Promise<User> {
        return new User((await axios.patch("api/auth/acceptTerms")).data)
    }

    static async ChangePassword(email: string): Promise<AxiosResponse> {
        return await axios.post("api/users/changePassword", email)
    }
}

export default BackendAPI;