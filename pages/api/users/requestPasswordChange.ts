import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { logRequest } from "../../../utils/backendLogger"
import { ERROR_MSG, ResponseFuncs } from "../../../utils/types"
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getUsers } from '../../../utils/getAuth0Users'
import { Users } from "../../../src/classes/Users";


const changePassword = async (email: string, res: NextApiResponse) => {
    const url = "https://lundsnation.eu.auth0.com/dbconnections/change_password"
    const options = {
        method: 'POST',
        url: url,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            client_id: process.env.REACT_APP_ID,
            email: email,
            connection: "Username-Password-Authentication"
        })
    }

    return await fetch(url, options)


}

export default changePassword;