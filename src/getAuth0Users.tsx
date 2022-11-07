
async function setAuth0Token() {
    const options = {
        method: 'POST',
        url: 'https://dev-otg4ju0e.us.auth0.com/oauth/token',
        headers: { 'content-type': 'application/json' },
        body: '{"client_id": "pbfa0jWn2CTVbp0wZMAUUSwOvmQGs08F", "client_secret": "EYr-521H0mJIsuNkGRuBLe3pSP9zftTn_DB5WcCGzeR0vnR-Wt_6iwoqBtYSqPAZ", "audience": "https://dev-otg4ju0e.us.auth0.com/api/v2/", "grant_type": "client_credentials"}',
    }

    const response = await fetch(options.url, options)
    const responseJson = await response.json()
    const parsed = await responseJson.access_token
    return parsed

}


export class getUsers {

    private token: Promise<string> = setAuth0Token()

    downloadJSON = (json: String) => {


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
            url: 'https://dev-otg4ju0e.us.auth0.com/api/v2/users',
            headers: { authorization: 'Bearer ' + token }
        }
        const response = await fetch(options.url, options)
        const data = await response.json()
        const parsed = JSON.stringify(data)


        this.downloadJSON(parsed)
    }

    private async _getSpecificUser(key: string, value: string) {
        const token = await this.token
        const specified = `${key} : "${value}"`
        const options = {
            method: 'GET',
            url: 'https://dev-otg4ju0e.us.auth0.com/api/v2/users?',
            headers: { authorization: 'Bearer ' + token }
        }

        const searchParams = new URLSearchParams({
            q: specified,
            search_engine: 'v3',
        })
        const response = await fetch(options.url + searchParams.toString(), options)
        const data = await response.json()
        const parser = JSON.parse(JSON.stringify(data))
        console.log(options.url + searchParams)

        return parser[0]

    }

    async checkForPrivliges(key: string, value: string) {
        this.getUser(key, value)
    }

    get allUsers() {
        return this._downloadAllUsers()
    }

    getUser(key: string, value: string) {
        return this._getSpecificUser(key, value)
    }


    get getToken() {
        return this.token
    }

}

