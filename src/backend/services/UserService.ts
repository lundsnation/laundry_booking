import {AxiosResponse} from "axios";
import HttpError from "../errors/HttpError";
import IUserService from "./IUserService";
import User, {JsonUser, NewUser, UserUpdate} from "../../classes/User";
import Auth0API from "../../apiHandlers/Auth0API";

class UserService {

    async getAllUsers(): Promise<JsonUser[]> {
        return await Auth0API.getUsers()
    }

    async getUserById(user_id: string): Promise<JsonUser> {
        return await Auth0API.getUser(user_id)

    }

    async createUser(user: NewUser): Promise<JsonUser> {
        return await Auth0API.createUser(user)
    }

    async deleteUser(userID: string): Promise<void> {
        await Auth0API.deleteUser(userID)
    }

    async patchUser(id: string, modification: UserUpdate): Promise<JsonUser> {
        return await Auth0API.patchUser(id, modification)
    }
}

export default UserService