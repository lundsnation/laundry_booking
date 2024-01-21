import {UserType} from "./types";

export class getUsers {
    private token: Promise<string>;
    private url: string;
    private id: string;

    constructor() {
        this.token = this.setAuth0Token()
        this.url = (process.env.AUTH0_ISSUER_BASE as string)
        this.id = (process.env.REACT_APP_ID as string)

    }

    private async setAuth0Token() {

        const secret = (process.env.REACT_APP_SECRET as string)
        const id = (process.env.REACT_APP_ID as string)
        const options = {
            method: 'POST',
            url: 'https://lundsnation.eu.auth0.com/oauth/token',
            headers: {'content-type': 'application/json'},
            body: `{"client_id" : "${id}", "client_secret": "${secret}", "audience" : "https://lundsnation.eu.auth0.com/api/v2/", "grant_type" : "client_credentials"}`,
        }
        const response = await fetch(options.url, options)
        const responseJson = await response.json()
        const parsed = await responseJson.access_token
        return parsed
    }

    private downloadJSON = (json: string) => {

        const dataStr = 'data:application/json;charset=utf-8,' + json
        const download = document.createElement('a')
        download.setAttribute('href', dataStr)
        download.setAttribute('download', 'Användare' + '.json')
        document.body.appendChild(download)
        download.click()
        download.remove()
    }

    private async _downloadAllUsers() {

        const token = await this.token
        const options = {
            method: 'GET',
            url: "https://lundsnation.eu.auth0.com/api/v2/users",
            headers: {authorization: 'Bearer ' + token}
        }
        const response = await fetch(options.url, options)
        const data = await response.json()
        const parsed = JSON.stringify(data)

        this.downloadJSON(parsed)

    }

    private async _createUser(user: UserType) {
        const token = await this.token
        const options = {
            method: 'POST',
            url: "https://lundsnation.eu.auth0.com/api/v2/users",
            headers: {authorization: 'Bearer ' + token, 'content-type': 'application/json'},
            body: JSON.stringify({...user, connection: "Username-Password-Authentication", email_verified: true})
            // body: `{"name": "${user.name}", "email": "${user.email}", "user_metadata": { "telephone": "${user.user_metadata?.telephone}"}, "app_metadata": { "acceptedTerms": ${user.app_metadata?.acceptedTerms} , "allowedSlots": ${user.app_metadata?.allowedSlots} , "roles": ["${user.app_metadata?.roles}"]}, "connection": "Username-Password-Authentication", "password": "${user.password}"}`,
        }
        return await fetch(options.url, options)
    }

    private async _modifyUser(modification: object, id: string) {
        const token = await this.token
        const options = {
            method: 'PATCH',
            url: 'https://lundsnation.eu.auth0.com/api/v2/users/' + id,
            headers: {authorization: 'Bearer ' + token, 'content-type': 'application/json'},
            body: JSON.stringify(modification)
        }
        return await fetch(options.url, options)
    }

    private async _deleteUser(id: string) {
        const token = await this.token
        const options = {
            method: 'DELETE',
            url: 'https://lundsnation.eu.auth0.com/api/v2/users/' + id,
            headers: {authorization: 'Bearer ' + token},
        }
        return await fetch(options.url, options)

    }

    private async _getAllUsers() {
        const token = await this.token
        let moreUsers = true
        let page = 0
        let finalData: Array<Object> = []
        while (moreUsers) {
            const options = {
                method: 'GET',
                url: `https://lundsnation.eu.auth0.com/api/v2/users?page=${page}`,
                headers: {authorization: 'Bearer ' + token, 'content-type': 'application/json'}
            }
            const response = await fetch(options.url, options)
            const data = await response.json()
            finalData.push(...data)
            if (data.length != 50) {
                moreUsers = false
            } else {
                page += 1
            }
        }
        return finalData
    }

    private async _getSpecificUser(key: string, value: string) {

        const token = await this.token
        const specified = `${key} : "${value}"`
        const options = {
            method: 'GET',
            url: "https://lundsnation.eu.auth0.com/api/v2/users?",
            headers: {authorization: 'Bearer ' + token}
        }

        const searchParams = new URLSearchParams({
            q: specified,
            search_engine: 'v3',
        })
        const response = await fetch(options.url + searchParams.toString(), options)
        const data = await response.json()
        const parser = JSON.parse(JSON.stringify(data))

        return parser[0]

    }

    private async _changePassword(email: string) {
        const token = await this.token
        const options = {
            method: 'POST',
            url: 'https://lundsnation.eu.auth0.com/dbconnections/change_password',
            // headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({client_id: this.id, email: email, connection: "Username-Password-Authentication"})
        }
        return await fetch(options.url, options)
    }

    /**
     * Fetches all users
     */
    getAllUsers() {
        return this._getAllUsers()
    }

    /**
     * Fetches the desired user using the supplied key-value pair
     */
    getUser(key: string, value: string) {
        if (!key || !value) {
            return
        }
        return this._getSpecificUser(key, value)
    }

    /**
     * Creates new user from supplied UserType
     */
    createUser(newUser: UserType) {
        return this._createUser(newUser)
    }

    /**
     * Function for modifying user with user_id 'id' properties in modification-object.
     */
    modifyUser(modification: object, id: string) {
        return this._modifyUser(modification, id)
    }

    /**
     * Function deleting user with user_id
     */
    deleteUser(id: string) {
        return this._deleteUser(id)
    }

    /**
     * Function triggering the change password-flow in auth0.
     */
    changePassword(email: string) {
        return this._changePassword(email)
    }

}