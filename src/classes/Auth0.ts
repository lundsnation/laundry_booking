import axios, { AxiosResponse } from 'axios';
import User, { JsonUser } from './User';
import { ModificationObject, UserType } from '../../utils/types';
import { deprecate } from 'util';
import HttpError from '../backend/errors/HttpError';

class Auth0 {
    private static client_id: string = process.env.AUTH0_CLIENT_ID as string;
    private static client_secret: string = process.env.AUTH0_CLIENT_SECRET as string;
    private static base_url: string = process.env.AUTH0_BASE_URL as string;
    private static api_url = 'https://lundsnation.eu.auth0.com/api/v2/';

    static async fetchAccessToken() {
        var options = {
            method: 'POST',
            url: 'https://lundsnation.eu.auth0.com/oauth/token',
            headers: { 'content-type': 'application/json' },
            data: {
                "grant_type": 'client_credentials',
                "client_id": this.client_id,
                "client_secret": this.client_secret,
                "audience": this.api_url,
            }
        };

        try {
            const response = await axios.request(options);
            return response.data.access_token;
        } catch (error) {
            console.error(error);
        }
    }

    //Denna borde också funka, men är icke testad.
    //static async fetchAccessToken() {
    //    const data = {
    //        "grant_type": 'client_credentials',
    //        "client_id": this.client_id,
    //        "client_secret": this.client_secret,
    //        "audience": this.api_url,
    //    }
    //
    //    const response = await axios.post('https://lundsnation.eu.auth0.com/oauth/token', data)
    //    if (response.statusText === "OK") {
    //        return response.data.access_token;
    //    } else {
    //        throw new Error("Could not fetch access token");
    //    }
    //}

    static async doUserExist(name: string): Promise<boolean> {
        const token = await Auth0.fetchAccessToken();
        const searchParams = new URLSearchParams({
            q: 'name : ' + name,
            search_engine: 'v3',
        })
        const user = await axios.get(Auth0.api_url + 'users?' + searchParams.toString(), {
            headers: {
                Authorization: 'Bearer ' + token
            },
        })
        if (user.status === 404) {
            return false;
        }
        return true;
    }

    static async getUserById(userID: string): Promise<JsonUser> {
        const token = await this.fetchAccessToken();
        const user = await axios.get(this.api_url + 'users/' + userID, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        if (user.status === 404) {
            throw new HttpError(HttpError.StatusCode.NOT_FOUND, "User not found")
        }

        return user.data as JsonUser;
    }

    static async getUserByName(name: string) {
        const token = await this.fetchAccessToken();
        const searchParams = new URLSearchParams({
            q: 'name : ' + name,
            search_engine: 'v3',
        })
        const user = await axios.get(this.api_url + 'users?' + searchParams.toString(), {
            headers: {
                Authorization: 'Bearer ' + token
            },
        })
        if (user.status === 404) {
            throw new HttpError(HttpError.StatusCode.NOT_FOUND, "User not found")
        }

        return user.data as JsonUser;
    }

    //Ändra typ eventuellt
    static async postUser(user: UserType): Promise<JsonUser> {
        const token = await this.fetchAccessToken();
        const doUserExist = await this.doUserExist(user.name)
        if (doUserExist) {
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "User already exists")
        }
        const response = await axios.post(this.api_url + 'users', user, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        if (response.status === 409) {
            throw new HttpError(HttpError.StatusCode.BAD_REQUEST, "User already exists")
        }
        return response.data as JsonUser;
    }

    //Ändra typ eventuellt
    static async patchUser(id: string, modification: ModificationObject): Promise<JsonUser> {
        const token = await this.fetchAccessToken();
        const response = await axios.patch(this.api_url + 'users/' + id, modification, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        if (response.status === 404) {
            throw new HttpError(HttpError.StatusCode.NOT_FOUND, "User not found")
        }
        return response.data as JsonUser

    }

    static async deleteUser(userID: string): Promise<void> {
        const token = await this.fetchAccessToken();
        const response = await axios.delete(this.api_url + 'users/' + userID, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        if (response.status === 404) {
            throw new HttpError(HttpError.StatusCode.NOT_FOUND, "User not found")
        }
    }


    static async getUsers() {
        const token = await this.fetchAccessToken();
        const users = []
        let page = 0;
        let moreUsers = true;
        while (moreUsers) {
            const response = await axios.get(`https://lundsnation.eu.auth0.com/api/v2/users?page=${page}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })

            const userBatch = response.data;
            users.push(...userBatch);

            if (userBatch.length < 50) {
                moreUsers = false;
            } else {
                page++;
            }
        }

        return users;
    }

    static async getUsersAsJsonUser(): Promise<JsonUser[]> {
        const users = await this.getUsers();
        if (users.length === 0) {
            throw new HttpError(HttpError.StatusCode.NOT_FOUND, "No users found")
        }
        return users.map(user => {
            return {
                sid: user.user_id,
                sub: user.user_id,
                name: user.name,
                nickname: user.nickname,
                email: user.email,
                email_verified: user.email_verified,
                picture: user.picture,
                user_metadata: {
                    picture: user.user_metadata.picture,
                    telephone: user.user_metadata.telephone,
                },
                app_metadata: {
                    acceptedTerms: user.app_metadata?.acceptedTerms,
                    allowedSlots: user.app_metadata?.allowedSlots,
                    roles: user.app_metadata?.roles,
                },
                updated_at: user.updated_at
            }
        })
    }

    static async getUsersAsUserType(): Promise<UserType[]> {
        const users = await this.getUsers();
        return users.map(user => {
            return {
                sub: user.user_id,
                name: user.name,
                email: user.email,
                user_metadata: {
                    telephone: user.user_metadata?.telephone,
                },
                app_metadata: {
                    acceptedTerms: user.app_metadata?.acceptedTerms,
                    allowedSlots: user.app_metadata?.allowedSlots,
                    roles: user.app_metadata?.roles,
                    building: user.app_metadata?.building,
                },
            }
        })
    }

    //Innebär inte detta att alla kan begära ändring av lösenord för alla användare?
    static async userChangePassword(email: string) {
        const token = await this.fetchAccessToken();
        const data = {
            "client_id": this.client_id,
            "email": email,
            "connection": "Username-Password-Authentication"
        }
        const response = await axios.post(this.api_url + 'users/' + data)
        return response
    }
}

export default Auth0;