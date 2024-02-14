import {handleAuth, handleProfile, Session} from "@auth0/nextjs-auth0";
import UserService from "../../../src/backend/services/UserService";
import WithErrorHandler from "../../../src/backend/errors/withErrorHandler";
import {NextApiRequest, NextApiResponse} from "next";

const userService = new UserService()
// Patches the user profile with the  flag and removes the refresh token from the session.
const acceptTerms = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const userUpdate = {
        name: session.user.name,
        app_metadata: {...session.user.app_metadata, acceptedTerms: true}
    };

    await userService.patchUser(session.user.sub, userUpdate)
    session.user.app_metadata.acceptedTerms = true
    delete session.refreshToken
    return session
}

// Patches the user profile with the updated email and telephone, and removes the refresh token from the session.
const updateProfile = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
    const profileUpdate = req.body
    const updatedUser = {
        name: profileUpdate.name,
        email: profileUpdate.email,
        user_metadata: {...session.user_metadata, telephone: profileUpdate.user_metadata.telephone},
        app_metadata: {...session.app_metadata}
    };

    await userService.patchUser(session.user.sub, updatedUser)
    //console.log(patchedUser)
    delete session.refreshToken
    session.user.email = profileUpdate.email
    session.user.user_metadata.telephone = profileUpdate.user_metadata.telephone
    return session
}

/**
 * *ProfileHandler
 * Exports a function with authentication and error handling for user profile actions ('accepted' and 'edit').
 * - `handleAuth` ensures requests are authenticated.
 * - `WithErrorHandler` provides consistent error handling across actions.
 *
 * Actions:
 * - `accepted`: Refetches the user profile and applies acceptance logic.
 * - `edit`: Refetches the user profile and applies edit logic.
 *
 * Each action calls `handleProfile` with:
 * - `refetch`: Boolean to refetch user profile data.
 * - `afterRefetch`: Callback for action-specific logic (`userAccept` for accepted, `userEdit` for edit).
 *
 * This structure secures endpoints to authenticated users and manages errors gracefully, ensuring robust user profile management.
 */
export default handleAuth({
    acceptTerms: WithErrorHandler(async (req, res) => {
        await handleProfile(req, res, {refetch: true, afterRefetch: acceptTerms});
    }),

    updateProfile: WithErrorHandler(async (req, res) => {
        await handleProfile(req, res, {refetch: true, afterRefetch: updateProfile});
    })
});