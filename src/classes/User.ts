import { Building, UserType } from "../../utils/types";
import Booking from "./Booking";
import { getUsers } from "../../utils/getAuth0Users";
import auth0UserManager from "../../utils/auth0UserManager";
import { ca, th } from "date-fns/locale";

class User {
    private user_id?: string
    private acceptedTerms?: boolean
    private roles: string[];
    public building?: Building;
    public name: string;
    public email: string;
    public telephone?: string;
    public allowedSlots?: number;
    // private _activeBookings: Booking[] = [];
    // private _bookings: Booking[] = [];


    constructor(name: string, email: string, roles?: string[], building?: Building, telephone?: string, acceptedTerms?: boolean, user_id?: string, allowedSlots?: number) {
        this.name = name;
        this.email = email;
        this.roles = roles ? roles : [];
        this.telephone = telephone;
        this.allowedSlots = allowedSlots;
        this.building = building;
        this.user_id = user_id;
        this.acceptedTerms = acceptedTerms;
    }

    set setAcceptedTerms(acceptedTerms: boolean) {
        this.acceptedTerms = acceptedTerms;
    }

    get getRoles(): string[] {
        return this.roles;
    }


    get getId(): string | undefined {
        return this.user_id;
    }

    get hasAcceptedTerms(): boolean {
        return this.acceptedTerms ? true : false;
    }

    setId(id: string) {
        this.user_id = id;
    }

    toJSON(): UserType {
        const { user_id, acceptedTerms, name, email, building, telephone, allowedSlots, roles } = this;

        return {
            user_id: user_id ? user_id : undefined,
            name: name,
            email: email,
            user_metadata: {
                telephone: telephone ? telephone : undefined,
            },
            app_metadata: {
                acceptedTerms: acceptedTerms ? acceptedTerms : undefined,
                allowedSlots: allowedSlots ? allowedSlots : undefined,
                roles: roles ? roles : undefined,
                building: building ? building : undefined,
            },
            connection: "Username-Password-Authentication"
        }
    }

    static fromJSON(json: UserType): User {
        const { name, email, user_id, user_metadata, app_metadata } = json;
        const roles: string[] = app_metadata?.roles ? app_metadata.roles : [];
        const building: Building | undefined = app_metadata?.building;
        const slots = json.app_metadata?.allowedSlots ? json.app_metadata.allowedSlots.toString() : undefined;
        const id = user_id ? Number.parseInt(user_id) : undefined;

        const user = new User(
            name,
            email,
            roles,
            building,
            user_metadata?.telephone,
            app_metadata?.acceptedTerms,
            slots,
            id);

        return user;
    }

    async GET_ID(): Promise<string | null> {
        const res = await this.GET()
        const json = await res.json()
        return json.user_id
    }

    //Fetches a user from the database using Name ex: NH1105
    async GET(): Promise<Response> {
        const jsonUser = JSON.stringify(this.toJSON())
        try {
            const specified = `name : ${this.name}`
            const searchParams = new URLSearchParams({
                q: specified,
                search_engine: 'v3',
            })
            const response = await fetch("/api/users/" + this.name, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                body: jsonUser,

            });

            return response;
        }
        catch (error) {
            console.error("Error getting user:", error);
            throw error;
        }
    }

    async PATCH(modification: object): Promise<Response> {
        try {
            const response = fetch("/api/users/" + this.name, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(modification)
            });
            return response;

        } catch (error) {
            console.error("Error patching user:", error);
            throw error;
        }
    }

    //Kan bli konstigt med attributen när en användare skapas
    async POST(): Promise<Response> {
        const jsonUser = JSON.stringify(this.toJSON())
        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: jsonUser
            });
            return response;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }

    async DELETE(): Promise<Response> {
        const api_url = "/api/users/" + this.name;
        try {
            const response = await fetch(api_url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.toJSON())
            });

            return response;

        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }
}

export default User;