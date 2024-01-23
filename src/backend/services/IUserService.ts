import { AxiosResponse } from "axios";
import { UserType } from "../../../utils/types";
import { JsonUser } from "../../classes/User";

interface IUserService {

    getAllUsers(): Promise<JsonUser[]>

    getUserById(userId: string): Promise<JsonUser>

    getUserByName(userName: string): Promise<JsonUser>

    createUser(user: any): Promise<JsonUser>

    deleteUser(userID: string): Promise<void>

    patchUser(id: string, modification: any): Promise<JsonUser>

}


export default IUserService;