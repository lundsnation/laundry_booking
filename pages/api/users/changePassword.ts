import { NextApiRequest, NextApiResponse } from "next"
import { logRequest } from "../../../utils/backendLogger"
import { ERROR_MSG, ResponseFuncs } from "../../../utils/types"
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getUsers } from '../../../utils/getAuth0Users'
import { AxiosResponse } from "axios";
import Auth0 from "../../../src/classes/Auth0";

const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
    const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
    const catcher = (error: Error) => res.status(400).json({ error: ERROR_MSG.GENERAL })
    const userFetcher = new getUsers()
    const userSession = await getSession(req, res)

    const handleCase: ResponseFuncs = {
        POST: async (req: NextApiRequest, res: NextApiResponse) => {
            logRequest('USER_CHANGEPASSWORD')
            const { email } = req.body
            if (userSession?.user.email === email) {
                res.status(403).json({ error: ERROR_MSG.NOTAUTHORIZED })
                return
            }

            const response = await Auth0.userChangePassword(email).catch(catcher) as AxiosResponse
            if (response.statusText === "OK") {
                res.status(200).json({ message: "Password changed" })
                return
            }
            res.status(500).json({ error: "Kunde inte byta lösenord" })
        }
    }

    const response = handleCase[method]
    if (response) return response(req, res)
    else return res.status(400).json({ error: ERROR_MSG.NOAPIRESPONSE })
});

export default handler