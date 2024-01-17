import axios from "axios";
import User from "./User";
import {UserType} from "../../utils/types";
import {ca} from "date-fns/locale";

export default class Users {

    private allUsers: User[] = [];


    constructor() {
        this.allUsers = [];
    }


    get(i: number): User {
        return this.allUsers[i];
    }

    indexOf(user_id: string): number {
        let index = 0;
        for (const user of this.allUsers) {
            if (user.getId === user_id) {
                return index;
            }
            index++;
        }
        return -1;
    }

    /**
     * Find a user by satisfying a predicate
     */
    find(predicate: (user: User) => boolean): User | undefined {
        return this.allUsers.find(predicate);
    }

    ok(): boolean {
        return this.allUsers.length > 0;
    }

    sort(arg0: (a: User, b: User) => any): Users {
        const sortedUsers = new Users();
        sortedUsers.allUsers = this.allUsers.sort(arg0);
        return sortedUsers;
    }

    /**
     * Returns a copy of a section of an array
     */
    slice(start?: number, end?: number): Users {
        const slicedUsers = new Users();
        slicedUsers.allUsers = this.allUsers.slice(start, end);
        return slicedUsers;
    }

    /**
     * Returns the length of allUsers
     */
    length(): number {
        return this.allUsers.length;
    }

    /**
     * Adds a user to allUsers
     */
    push(users: User): void {
        this.allUsers.push(users as User);
        return
    }

    add(user: User): Users {
        const newUsers = new Users();
        newUsers.allUsers = [...this.allUsers, user];
        return newUsers;
    }

    contains(user: User): boolean {
        const uid = user.getId;
        return this.allUsers.some(user => user.getId === uid);
    }

    //method that removes user from allUsers and returns a new Users object
    remove(user: User): Users {
        const uid = user.getId;
        const newUsers = Users.fromArray(this.allUsers);
        newUsers.allUsers = this.allUsers.filter(user => user.getId !== uid);
        return newUsers;
    }

    getUsers(): User[] {
        return this.allUsers;
    }

    filter(predicate: (user: User) => boolean): Users {
        const filteredUsers = new Users();
        filteredUsers.allUsers = this.allUsers.filter(predicate);
        return filteredUsers;
    }

    map(callback: (user: User, index: number, array: User[]) => any): any[] {
        return this.allUsers.map(callback);
    }

    forEach(callback: (user: User, index: number, array: User[]) => void): void {
        this.allUsers.forEach(callback);
    }

    copy(): Users {
        const copiedUsers = new Users();
        copiedUsers.allUsers = [...this.allUsers];
        return copiedUsers;
    }

    //createUser(user: User | UserType): Promise<Response> {
    //    return this._createUser(user);
    //}
    //
    //modifyUser(userId: string, modification: object): Promise<Response> {
    //    return this._modifyUser(userId, modification);
    //}
    //
    //deleteUser(userId: string): Promise<Response> {s
    //    return this._deleteUser(userId);
    //}

    toJSON(): UserType[] {
        return this.allUsers.map(user => user.toJSON());
    }

    // Tror alla dessa är onödiga. Funktinoalitet för att skapa modifiera och ta bort användare finns i User.ts. Om du ex vill ta bort så borde du kunna göra en find, få användaren och sen göra USER.delete.

    //private async _createUser(user: User | UserType): Promise<Response> {
    //    try {
    //        if (user instanceof User) {
    //            return await user.POST();
    //        }
    //        else {
    //            const newUser = User.fromJSON(user);
    //            return await newUser.POST();
    //        }
    //    } catch (error) {
    //        console.log(error)
    //        return new Response("Error: Error creating user", { status: 500 })
    //    }
    //}
    //
    //
    //private async _modifyUser(userId: string, modification?: object): Promise<Response> {
    //    const user = this.allUsers.find(user => user.getId === userId)
    //    if (user) {
    //        return await user.PATCH()
    //    }
    //    else {
    //        return new Response("Error: User not found", { status: 404 })
    //    }
    //}
    //
    //private async _deleteUser(userId: string): Promise<Response> {
    //    const user = this.allUsers.find(user => user.getId === userId)
    //    if (user) {
    //        return await user.DELETE()
    //    }
    //    else {
    //        return new Response("ERROR: User not found", { status: 404 })
    //    }
    //}


    static fromArray(users: User[]): Users {
        const newUsers = new Users();
        newUsers.allUsers = users;
        return newUsers;
    }

    static fromJSON(json: UserType[]): Users {
        const users = new Users();
        users.allUsers = json.map((userData: UserType) =>
            User.fromJSON(userData)
        );
        return users;
    }

    static async fetch(): Promise<Users> {
        //TODO: NEEED TO CHANGE URL
        const url = "/api/users"
        try {
            const response = await axios.get(url)
            const data = await response.data
            const users = new Users();


            users.allUsers = data.map((userData: UserType) => {
                return User.fromJSON(userData as UserType);
            })

            return users;

        } catch (error) {
            console.error("Error fetching users from Auth0API:", error);
            throw error;
        }
    }
}
