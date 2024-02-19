import {JsonUser, NewUser, UserBookingInfo, UserUpdate} from "../../frontend/classes/User";
import Auth0API from "../../apiHandlers/Auth0API";
import HttpError from "../errors/HttpError";

class UserService {

    async getAllUsers(): Promise<JsonUser[]> {
        return await Auth0API.getUsers()
    }

    async getUserById(user_id: string): Promise<JsonUser> {
        return await Auth0API.getUser(user_id)
    }

    async getUserBookingInfo(user_id: string): Promise<UserBookingInfo> {
        return await Auth0API.getUserBookingInfo(user_id)
    }

    async createUser(user: NewUser): Promise<JsonUser> {
        //Ensure uniqueness of username in building
        if (await Auth0API.usernameExistsInBuilding(user.name, user.app_metadata.laundryBuilding)) {
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "Username already exists in building")
        }

        return await Auth0API.createUser(user)
    }

    async deleteUser(userID: string): Promise<void> {
        //Perhaps logic for deleting bookings by user should be here
        await Auth0API.deleteUser(userID)
    }

    async patchUser(id: string, userUpdate: UserUpdate): Promise<JsonUser> {
        //Ensure uniqueness of username in building
        const user = await Auth0API.getUser(id)
        console.log("UserUpdatename", userUpdate.name)
        if (user.name !== userUpdate.name && await Auth0API.usernameExistsInBuilding(userUpdate.name, user.app_metadata.laundryBuilding)) {
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "Username already exists in building")
        }

        return await Auth0API.patchUser(id, userUpdate)
    }

    async changePasswordByEmail(email: string) {
        return await Auth0API.userChangePasswordEmail(email)
    }
}

export default UserService