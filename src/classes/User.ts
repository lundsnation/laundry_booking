import axios from "axios";
import { Building, UserEdit, UserType, ModificationObject } from "../../utils/types";
import Booking from "./Booking";
import { ca, th } from "date-fns/locale";


export default class User {
    public name: string;
    public email: string;
    private user_id: string
    public telephone?: string;
    public building?: Building;
    private acceptedTerms?: boolean
    public allowedSlots?: number;
    private roles: string[];
    public connection: string;


    // public props: UserType = {
    //     user_id: undefined,
    //     name: "",
    //     email: "",
    //     roles: undefined
    // .........
    // }



    constructor(name?: string, email?: string, user_id?: string, roles?: string[], building?: Building, telephone?: string, acceptedTerms?: boolean, allowedSlots?: number) {

        this.name = name ? name : "";
        this.email = email ? email : "";
        this.user_id = user_id ? user_id : "";
        this.roles = roles ? roles : ['user'];
        this.telephone = telephone;
        this.allowedSlots = allowedSlots;
        this.building = building;
        this.acceptedTerms = acceptedTerms ? acceptedTerms : false;
        this.connection = "Username-Password-Authentication";
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

    async editProfile(modification: UserEdit): Promise<boolean> {
        try {
            const url = "/api/auth/edit"
            const res = await fetch(url, {
                method: "PATCH",
                body: JSON.stringify({
                    email: modification.email ? modification.email : "",
                    telephone: modification.telephone ? modification.telephone : "",
                }),
            })

            if (res.status === 200) {
                this.email = modification.email ? modification.email : this.email;
                this.telephone = modification.telephone ? modification.telephone : this.telephone;
                return true;
            }
            return false

        } catch (error) {
            console.log(error)
            return false;
        }
    }


    mergeUser(other: User): void {
        const { roles, building, telephone, allowedSlots, acceptedTerms } = other;
        this.roles = roles ? roles : this.roles;
        this.building = building ? building : this.building;
        this.telephone = telephone ? telephone : this.telephone;
        this.allowedSlots = allowedSlots ? allowedSlots : this.allowedSlots;
        this.acceptedTerms = acceptedTerms ? acceptedTerms : this.acceptedTerms;
    }
    update(modification: object): void {
        //Update attributes in this instance with this.modification
        //setModification used to PATCH
        const { name, acceptedTerms, email, user_metadata, app_metadata } = modification as ModificationObject
        this.name = name ? name : this.name
        this.email = email ? email : this.email
        this.acceptedTerms = acceptedTerms ? acceptedTerms : this.acceptedTerms
        if (user_metadata) {
            this.telephone = user_metadata.telephone ? user_metadata.telephone : this.telephone
        }

        if (app_metadata) {
            this.building = app_metadata.building ? app_metadata.building : this.building
            this.allowedSlots = app_metadata.allowedSlots ? app_metadata.allowedSlots : this.allowedSlots
        }

    }

    toProfile(): UserEdit {
        return { email: this.email, telephone: this.telephone ? this.telephone : undefined }
    }

    toJSON(): UserType {
        const { user_id, acceptedTerms, name, email, building, telephone, allowedSlots, roles } = this;

        return {
            sub: user_id ? user_id : undefined,
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
        }
    }

    public toString(): string {
        return `
          Name: ${this.name}
          Email: ${this.email}
          User ID: ${this.user_id}
          Telephone: ${this.telephone || 'N/A'}
          Building: ${this.building ? this.building.toString() : 'N/A'}
          Accepted Terms: ${this.acceptedTerms ? 'Yes' : 'No'}
          Allowed Slots: ${this.allowedSlots || 'N/A'}
          Roles: ${this.roles.join(', ')}
          Connection: ${this.connection}
        `;
    }

    static async fromId(id: string): Promise<User> {
        const newUser = new User("", "", id)
        const newUserCtx = await newUser.GET()
        const json = await newUserCtx.data
        newUser.name = json.name
        newUser.email = json.email
        newUser.telephone = json.user_metadata?.telephone
        newUser.building = json.app_metadata?.building
        newUser.roles = json.app_metadata?.roles
        newUser.allowedSlots = json.app_metadata?.allowedSlots
        newUser.acceptedTerms = json.app_metadata?.acceptedTerms
        return newUser
    }

    static fromJSON(json: UserType): User {
        const { name, email, sub, user_metadata, app_metadata } = json;

        const roles: string[] = app_metadata?.roles ? app_metadata.roles : [];
        const building: Building | undefined = app_metadata?.building;
        const slots = json.app_metadata?.allowedSlots ? json.app_metadata.allowedSlots : undefined;
        const id = sub ? sub : undefined;

        const user = new User(
            name,
            email,
            id,
            roles,
            building,
            user_metadata?.telephone,
            app_metadata?.acceptedTerms,
            slots);

        return user;
    }

    //Borde inte behövas
    static fromUser(user: User): User {
        const { name, email, telephone, allowedSlots, acceptedTerms, building, roles, user_id } = user
        return new User(name, email, user_id, roles, building, telephone, acceptedTerms, allowedSlots)
    }

    clone(): User {
        const {
            name,
            email,
            user_id,
            roles,
            building,
            telephone,
            acceptedTerms,
            allowedSlots,
        } = this;

        // Create a new User instance with the same properties as the current instance (this)
        const clonedUser = new User(
            name,
            email,
            user_id,
            [...roles], // Copy the roles array to prevent modification of the original array
            building ? building : undefined, // Copy the building object if it exists
            telephone,
            acceptedTerms,
            allowedSlots
        );

        return clonedUser;
    }

    //Fetches a user from the database using id
    async GET() {
        try {
            const response = await axios.get("/api/users/" + this.user_id);
            return response;
        }
        catch (error) {
            console.error("Error getting user:", error);
            throw error;
        }
    }

    async PATCH(modification: ModificationObject): Promise<Response> {
        try {
            const response = fetch("/api/users/" + this.user_id, {
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

    // async PATCH(): Promise<Response> {

    //     try {
    //         const response = await fetch("/api/users/" + this.user_id, {
    //             method: "PATCH",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify(this.modification)
    //         });

    //         this.modification = {}

    //         return response;

    //     } catch (error) {
    //         console.error("Error patching user:", error);
    //         throw error;
    //     }
    // }

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
        const api_url = "/api/users/" + this.user_id;
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

