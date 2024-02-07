import {handleAuth, handleProfile, handleCallback, updateSession} from "@auth0/nextjs-auth0";
import UserService from "../../../src/backend/services/UserService";
import WithErrorHandler from "../../../src/backend/errors/withErrorHandler";

const userService = new UserService()
// Patches the user profile with the acceptance flag and removes the refresh token from the session.
const userAccept = async (req, res, session) => {
    const updatedUser = {
        ...session.user,
        app_metadata: {...session.user.app_metadata, acceptedTerms: true}
    };

    const patchedUser = await userService.patchUser(session.user.sub, updatedUser)
    session.user.app_metadata.acceptedTerms = true
    delete session.refreshToken
    return session
}

// Patches the user profile with the updated email and telephone, and removes the refresh token from the session.
const userEdit = async (req, res, session) => {
    const {email, telephone} = JSON.parse(req.body)

    const updatedUser = {
        ...session.user,
        email: email, user_metadata: {...session.user_metadata, telephone: telephone}
    };

    const patchedUser = await userService.patchUser(session.user.sub, updatedUser)
    delete session.refreshToken
    session.user.user_metadata.telephone = telephone
    session.user.email = email
    return session
}

/**
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
    accepted: WithErrorHandler(async (req, res) => {
        await handleProfile(req, res, {refetch: true, afterRefetch: userAccept});
    }),

    edit: WithErrorHandler(async (req, res) => {
        await handleProfile(req, res, {refetch: true, afterRefetch: userEdit});
    })
});