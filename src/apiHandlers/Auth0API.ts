import {AuthenticationClient, GetUsers200ResponseOneOfInner, ManagementClient} from 'auth0';
import {JsonUser, NewUser, UserUpdate} from '../classes/User';

// Class to handle communication with Auth0 API from the backend only


class Auth0API {

    private static management = new ManagementClient({
        domain: process.env.AUTH0_ISSUER_BASE_URL as string,
        clientId: process.env.AUTH0_CLIENT_ID as string,
        clientSecret: process.env.AUTH0_CLIENT_SECRET as string
    });

    private static authentication = new AuthenticationClient({
        domain: process.env.AUTH0_ISSUER_BASE_URL as string,
        clientId: process.env.AUTH0_CLIENT_ID as string,
        clientSecret: process.env.AUTH0_CLIENT_SECRET as string
    });

    private static user_management = this.management.users;
    private static auth_management = this.authentication;

    static async getUser(UserID: string) {
        const user = (await this.user_management.get({id: UserID})).data
        return this.remapToJsonUser(user);
    }

    static async createUser(newUser: NewUser) {
        const user = (await this.user_management.create(newUser)).data
        return this.remapToJsonUser(user);
    }

    static async patchUser(id: string, modification: UserUpdate) {
        const user = (await this.user_management.update({id: id}, modification)).data
        return this.remapToJsonUser(user);
    }

    static async deleteUser(id: string) {
        return await this.user_management.delete({id: id})
    }

    static async getUsers() {
        const users = []
        let page = 0;
        let moreUsers = true;
        while (moreUsers) {
            const response = await this.user_management.getAll({
                page: page,
                per_page: 50,
            })

            const userBatch = response.data;
            users.push(...userBatch);

            if (userBatch.length < 50) {
                moreUsers = false;
            } else {
                page++;
            }
        }

        return users.map(user => this.remapToJsonUser(user));
    }

    static async userChangePasswordEmail(email: string) {
        return await this.auth_management.database.changePassword({
            email: email,
            connection: 'Username-Password-Authentication'
        })
    }

    private static remapToJsonUser(auth0User: GetUsers200ResponseOneOfInner): JsonUser {
        return {
            sub: auth0User.user_id,
            name: auth0User.name,
            nickname: auth0User.nickname,
            email: auth0User.email,
            email_verified: auth0User.email_verified,
            picture: auth0User.picture,
            app_metadata: {
                acceptedTerms: auth0User.app_metadata.acceptedTerms,
                allowedSlots: auth0User.app_metadata.allowedSlots,
                roles: auth0User.app_metadata.roles,
                laundryBuilding: auth0User.app_metadata.laundryBuilding,
            },
            user_metadata: {
                picture: auth0User.user_metadata.picture || auth0User.picture, // Assuming picture can be in user_metadata or default to main picture
                telephone: auth0User.user_metadata.telephone, // Assuming telephone is stored in user_metadata
            },
            updated_at: auth0User.updated_at.toString(),
        };
    }
}

export default Auth0API;