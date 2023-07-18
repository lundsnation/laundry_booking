import { handleAuth, handleProfile, handleCallback, updateSession } from "@auth0/nextjs-auth0";
import Auth0 from '../../../src/classes/Auth0'

// Function triggered on user accepting user-agreement and GDPR-terms, if modification was sucessfull, updates the user-session
const userAccept = async (req, res, session) => {
    const modification = {
        app_metadata: { ...session.user.app_metadata, acceptedTerms: true }
    }
    try {
        const response = await Auth0.patchUser(session.user.sub, modification)
        if (response.statusText === "OK") {
            session.user.app_metadata.acceptedTerms = true
            delete session.refreshToken
            return session
        }
        return session
    } catch (error) {
        console.log(error)
    }
}

//// Function triggered on user-modification done by the user, if modification was sucessfull, updates the user-session
const userEdit = async (req, res, session) => {

    const { email, telephone } = JSON.parse(req.body)

    const modification = {
        email: email, user_metadata: { ...session.user_metadata, telephone: telephone }
    }

    try {
        const response = await Auth0.patchUser(session.user.sub, modification)
        if (response.statusText === "OK") {
            delete session.refreshToken
            session.user.user_metadata.telephone = telephone
            session.user.email = email
            return session
            // return { ...session, user: { ...session.user, modification } }
        }

        return session
    } catch (error) {
        console.log(error)
    }
}

/* Overriding default auth-handler, api/auth/accepted will intially update userInfo
*  using atuh0 Authentication API, thn refetch the userSession from Auth0 
*  authentication API at route: /userinfo. Since the custom app_metadata property only is set on 
*  user upon login, we will have to manually set it afterRefetch, if user modification
*  was unsucessfull, the previous, unchanged session will be returned, yielding no effect.
*  / Axel 
*/
export default handleAuth({
    accepted: async (req, res) => {
        try {
            await handleProfile(req, res, { refetch: true, afterRefetch: userAccept });
        } catch (error) {
            console.error(error);
        }
    },

    edit: async (req, res) => {
        try {
            await handleProfile(req, res, { refetch: true, afterRefetch: userEdit });
        } catch (error) {
            console.error(error);
        }
    }
});