import { handleAuth, handleProfile, handleCallback } from "@auth0/nextjs-auth0";
import { getUsers } from "../../../utils/getAuth0Users"
import { Users } from "../../../src/classes/Users";

// Function triggered on user accepting user-agreement and GDPR-terms, if modification was sucessfull, updates the user-session
const userAccept = async (req, res, session, state) => {
  try {
    // const userModifier = new getUsers()
    // const response = await userModifier.modifyUser(
    // { app_metadata: { ...session.user.app_metadata, acceptedTerms: true } }
    // , session.user.sub)
    const userModifier = await Users.fetch(session)
    const response = await userModifier.modifyUser(session.user.sub, { app_metadata: { ...session.user.app_metadata, acceptedTerms: true } })
    if (response.ok) {
      session.user.app_metadata.acceptedTerms = true
      delete session.refreshToken
      return session
    }
    return session
  } catch (error) {
    console.log("Error in userAccept: ", error)
    throw error
  }
};

// Function triggered on user-modification done by the user, if modification was sucessfull, updates the user-session
const userEdit = async (req, res, session, state) => {
  try {
    const userModifier = new getUsers()
    const { sid, sub, updated_at, ...edit } = { ...session.user, email: req.body.email, user_metadata: req.body.user_metadata }
    const response = await userModifier.modifyUser(edit, session.user.sub)
    if (response.ok) {
      delete session.refreshToken
      return { ...session, user: { ...session.user, email: req.body.email, user_metadata: { ...req.body.user_metadata } } }
    }
    return session
  } catch (error) {
    throw error
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
      res.status(200).json({ message: "User updated" })
    } catch (error) {
      console.error(error);
    }
  }
});