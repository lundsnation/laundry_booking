import axios from 'axios';
import User from './User';

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
    static async postUser(user: any) {
        const token = await this.fetchAccessToken();
        const response = await axios.post(this.api_url + 'users', user, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })

        return response
    }

    //Ändra typ eventuellt
    static async patchUser(id: string, modification: object) {
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
            const response = await axios.get(this.api_url + 'users', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            const userBatch = response.data;
            users.push(userBatch);

            if (userBatch.length < 50) {
                moreUsers = false;
            } else {
                page++;
            }
        }

        return users;
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