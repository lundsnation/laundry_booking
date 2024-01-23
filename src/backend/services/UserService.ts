import { AxiosResponse } from "axios";
import { ModificationObject, UserType } from "../../../utils/types";
import Auth0 from "../../classes/Auth0";
import HttpError from "../errors/HttpError";
import IUserService from "./IUserService";
import User, { JsonUser } from "../../classes/User";

class UserService implements IUserService {

    async getAllUsers(): Promise<JsonUser[]> {
        return await Auth0.getUsersAsJsonUser()
    }

    async getUserById(user_id: string): Promise<JsonUser> {
        return await Auth0.getUserById(user_id)

    }

    async getUserByName(user_name: string): Promise<JsonUser> {
        return await Auth0.getUserByName(user_name)
    }

    //user parameter type needs to be changed
    async createUser(user: User): Promise<JsonUser> {
        return await Auth0.postUser(user)
    }

    async deleteUser(userID: string): Promise<void> {
        await Auth0.deleteUser(userID)
    }

    async patchUser(id: string, modification: ModificationObject): Promise<JsonUser> {
        return await Auth0.patchUser(id, modification)
    }
}

export default UserService