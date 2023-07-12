import { NextApiRequest, NextApiResponse } from "next"
import { logRequest } from "../../../utils/backendLogger"
import { ERROR_MSG, ResponseFuncs } from "../../../utils/types"
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getUsers } from '../../../utils/getAuth0Users'
import { Users } from "../../../src/classes/Users";
import { pusherBackend } from "../../../utils/pusherAPI"
import { assert } from "console";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
    const session = await getSession(req, res)
    const user = session?.user
    console.log("NAME: " + user?.name)
    const catcher = (error: Error) => res.status(400).json({ error: ERROR_MSG.GENERAL })

    const accessToken = async () => {
        const url = "http://localhost:3000/api/auth/accessToken"
        try {
            const response = await fetch(url)
            const data = await response.json()
            const token = await data.access_token
            return token
        } catch (error) {
            console.error("Error fetching token from 'api/auth':", error);
            throw error;
        }
    }

    const handleCase: ResponseFuncs = {

        GET: async (req: NextApiRequest, res: NextApiResponse) => {
            logRequest('GET_THIS_USER')
            const token = await accessToken()
            console.log("TOKEN: " + token)
            const url = "https://lundsnation.eu.auth0.com/api/v2/users?"
            const options = {
                method: 'GET',
                url: url + "q=name:" + user?.name,
                params: { search_engine: 'v3' },
                headers: { authorization: 'Bearer ' + token },

            }
            try {
                const response = await fetch(options.url, options)
                const json = await response.json()
                res.status(200).json(json)
            } catch (error) {
                res.status(500).json({ error: ERROR_MSG.AUTH0RESPONSEERROR })
                throw error
            }
        },

        POST: async (req: NextApiRequest, res: NextApiResponse) => {
            logRequest('POST_USER')
            const url = "https://lundsnation.eu.auth0.com/api/v2/users"
            const userSession = await getSession(req, res)

            const newUser = req.body

            if (userSession?.user.app_metadata.roles.indexOf("admin") > -1) {
                const token = await accessToken()
                const options = {
                    method: 'POST',
                    url: url,
                    headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
                    body: JSON.stringify(newUser)
                }

                const result = await fetch(url, options)
                const json = await result.json()
                if (result?.ok) {
                    res.status(200).json(json)
                } else {
                    res.status(500).json({ error: ERROR_MSG.AUTH0RESPONSEERROR })
                }
            } else {
                res.status(403).json({ error: ERROR_MSG.NOTAUTHORIZED })
            }
        },
    }

    const response = handleCase[method]
    if (response) return response(req, res)
    else return res.status(400).json({ error: ERROR_MSG.NOAPIRESPONSE })
};

export default withApiAuthRequired(handler)