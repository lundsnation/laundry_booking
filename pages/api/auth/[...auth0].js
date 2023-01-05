import { handleAuth,handleProfile,handleCallback } from "@auth0/nextjs-auth0";
import { getUsers } from "../../../utils/getAuth0Users"

const userAccept = async (req, res, session, state) => {
    try{
        const userModifier = new getUsers()
        const response = await userModifier.modifyUser(
            {app_metadata: {...session.user.app_metadata, acceptedTerms : true}}
            ,session.user.sub)
        if(response.ok){
            session.user.app_metadata.acceptedTerms = true
            delete session.refreshToken
            return session
        }
     return session 
    }catch(error){
        throw error
    }
  };

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
        await handleProfile(req, res, { refetch: true, afterRefetch : userAccept });
      } catch (error) {
        console.error(error);
      }
    }
  });