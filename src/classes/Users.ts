import axios from "axios";
import User from "./User";
import { UserType } from "../../utils/types";
import { ca } from "date-fns/locale";

export class Users {
    private allUsers: User[];

    constructor() {
        this.allUsers = [];
    }

    /**
    * Find a user by satisfying a predicate
    */
    find(predicate: (user: User) => boolean): User | undefined {
        return this.allUsers.find(predicate);
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
    addUser(user: User): void {
        this.allUsers.push(user);
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

    createUser(user: User | UserType): Promise<Response> {
        return this._createUser(user);
    }

    modifyUser(userId: string, modification: object): Promise<Response> {
        return this._modifyUser(userId, modification);
    }

    deleteUser(userId: string): Promise<Response> {
        return this._deleteUser(userId);
    }

    private async _createUser(user: User | UserType): Promise<Response> {
        try {
            if (user instanceof User) {
                return await user.POST();
            }
            else {
                const newUser = User.fromJSON(user);
                return await newUser.POST();
            }
        } catch (error) {
            console.log(error)
            return new Response("ERROR: Error creating user", { status: 500 })
        }
    }

    private async _modifyUser(userId: string, modification: object): Promise<Response> {
        const user = this.allUsers.find(user => user.getId === userId)
        if (user) {
            return await user.PATCH(modification)
        }
        else {
            return new Response("ERROR: User not found", { status: 404 })
        }
    }

    private async _deleteUser(userId: string): Promise<Response> {
        const user = this.allUsers.find(user => user.getId === userId)
        if (user) {
            return await user.DELETE()
        }
        else {
            return new Response("ERROR: User not found", { status: 404 })
        }
    }

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
        const url = "http://localhost:3000/api/users"
        try {
            const response = await fetch(url)
            console.log(response.status)
            const data = await response.json()
            console.log("DATA!!!!! : " + JSON.stringify(data))
            const users = new Users();


            // users.allUsers = data.for((userData: UserType) => {
            //     User.fromJSON(userData as JsonUser);
            // })

            // console.log(users.allUsers)

            return users;

        } catch (error) {
            console.error("Error fetching users from Auth0:", error);
            throw error;
        }
    }
}
