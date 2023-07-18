import { NextApiRequest, NextApiResponse } from "next"
import { logRequest } from "../../../utils/backendLogger"
import { ERROR_MSG, ResponseFuncs } from "../../../utils/types"
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getUsers } from '../../../utils/getAuth0Users'
import Auth0 from "../../../src/classes/Auth0";
import { AxiosResponse } from "axios";

const handler = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
    const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs
    const userFetcher = new getUsers()
    const userSession = await getSession(req, res)

    if (!userSession?.user.app_metadata.roles.includes("admin")) {
        return res.status(401).json({ error: ERROR_MSG.NOTAUTHORIZED })
    }

    const handleCase: ResponseFuncs = {
        GET: async (req: NextApiRequest, res: NextApiResponse) => {
            logRequest('GET_ALL_USERS')
            try {
                const data = await Auth0.getUsers();
                console.log("GOT HERE");
                return res.status(200).json(data);
            } catch (error) {
                console.log("error")
                return res.status(500).json({ error: "Kunde inte hämta användare" });
            }
        },

        POST: async (req: NextApiRequest, res: NextApiResponse) => {
            logRequest('POST_USER')
            const user = req.body;
            console.log(req.body)
            try {
                const response = await Auth0.postUser(user);
                if (response.statusText === "OK") {
                    return res.status(200).json(response.data);
                } else {
                    return res.status(500).json({ error: "Kunde inte skapa användaren" });
                }
            } catch (error) {
                console.log("error: ", error)
                return res.status(500).json({ error: "Kunde inte skapa användaren" });
            }
        },
    }

    const response = handleCase[method];
    if (response) {
        return response(req, res);
    } else {
        return res.status(400).json({ error: ERROR_MSG.NOAPIRESPONSE });
    }
});

export default handler;
