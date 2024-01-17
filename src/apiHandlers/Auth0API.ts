import axios, {AxiosResponse} from 'axios';
import User from '../classes/User';
import {ModificationObject, UserType} from '../../utils/types';

class Auth0API {
    private static client_id: string = process.env.AUTH0_CLIENT_ID as string;
    private static client_secret: string = process.env.AUTH0_CLIENT_SECRET as string;
    private static base_url: string = process.env.AUTH0_BASE_URL as string;
    private static api_url = 'https://lundsnation.eu.auth0.com/api/v2/';

    static async fetchAccessToken() {
        var options = {
            method: 'POST',
            url: 'https://lundsnation.eu.auth0.com/oauth/token',
            headers: {'content-type': 'application/json'},
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

    static async getUser(userID: string) {
        const token = await this.fetchAccessToken();
        const response = await axios.get(this.api_url + 'users/' + userID, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })

        return response;
    }

    //Ändra typ eventuellt
    static async postUser(user: UserType) {
        const token = await this.fetchAccessToken();

        user = {...user, connection: "Username-Password-Authentication", email_verified: true}
        const response = await axios.post(this.api_url + 'users', user, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response
    }

    //Ändra typ eventuellt
    static async patchUser(id: string, modification: ModificationObject): Promise<AxiosResponse> {
        const token = await this.fetchAccessToken();
        const response = await axios.patch(this.api_url + 'users/' + id, modification, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        return response
    }

    static async deleteUser(userID: string) {
        const token = await this.fetchAccessToken();
        const response = await axios.delete(this.api_url + 'users/' + userID, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })

        return response
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

export default Auth0API;