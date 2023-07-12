import { NextApiRequest, NextApiResponse } from "next"
import { logRequest } from "../../../utils/backendLogger"
import { ERROR_MSG, ResponseFuncs } from "../../../utils/types"
import { withApiAuthRequired, getSession, getAccessToken } from '@auth0/nextjs-auth0';
import { getUsers } from '../../../utils/getAuth0Users'
import User from "../../../src/classes/User";
import { Users } from "../../../src/classes/Users";

//Redo of /api/user, this is /api/users (notice the "s") 

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
    const catcher = (error: Error) => res.status(400).json({ error: ERROR_MSG.GENERAL })
    const session = await getSession(req, res)
    const user = session?.user.name

    // Request is user.name (*/api/user/NH1111 for example)
    const id: string = req.query.id as string
    console.log(id)


    const retrieveAccessToken = async (req: NextApiRequest, res: NextApiResponse) => {
        const secret = process.env.REACT_APP_SECRET
        const id = process.env.REACT_APP_ID

        try {
            const options = {
                method: 'POST',
                url: 'https://lundsnation.eu.auth0.com/oauth/token',
                headers: { 'content-type': 'application/json' },
                body: `{"client_id" : "${id}", "client_secret" : "${secret}", "audience" : "https://lundsnation.eu.auth0.com/api/v2/", "grant_type" : "client_credentials"}`,
            }
            const response = await fetch(options.url, options)

            if (!response.ok) {
                console.log("RESPONSE: " + response.status + " " + response.statusText + "\n")
                throw new Error("Error in response when fetching token from Auth0")
            }

            // const json = await response.json()
            // console.log("IN RETRIEVE, TOKEN: " + json.access_token)

            return response




        } catch (error) {
            console.error("Error fetching token from Auth0:", error);
            res.status(500).json({ error: ERROR_MSG.AUTH0RESPONSEERROR })
            throw error;
        }

    }

    const handleCase: ResponseFuncs = {
        GET: async (req: NextApiRequest, res: NextApiResponse) => {
            try {
                const token = await retrieveAccessToken(req, res)
                res.status(200).json({ access_token: token })
            } catch (error) {
                console.error("Error fetching token from 'api/auth':", error);
                throw error;
            }

        }
    }
    const response = handleCase[method]
    if (response) return response(req, res)
    else return res.status(400).json({ error: ERROR_MSG.NOAPIRESPONSE })
}
export default handler