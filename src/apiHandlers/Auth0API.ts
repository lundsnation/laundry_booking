import { AuthenticationClient, ManagementClient } from 'auth0';
import { JsonUser } from '../classes/User';

export interface ModificationObject {
    name: string,
    email?: string,
    user_metadata?: {
        telephone?: string,
    },
    app_metadata?: {
        acceptedTerms?: boolean,
        allowedSlots?: number,
        building?: string,
    },
}

type NewUser = {
    name: string,
    email: string,
    connection: string,
    password: string,
    email_verified: boolean,

}

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
        return await this.user_management.get({ id: UserID })
    }

    static async createUser(user: NewUser) {
        this.user_management.create(user)
    }

    static async postUser(user: NewUser) {
        return await this.user_management.create(user)
    }

    static async patchUser(id: string, modification: ModificationObject) {
        return await this.user_management.update({ id: id }, modification)
    }

    static async deleteUser(id: string) {
        return await this.user_management.delete({ id: id })
    }

    static async getAllUsers() {
        return await this.user_management.getAll({})
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

        return users;
    }


    static async getUsersAsUserType(): Promise<JsonUser[]> {
        const users = await this.getUsers();
        return users.map(user => {
            return {
                sub: user.user_id,
                name: user.name,
                nickname: user.nickname,
                email: user.email,
                email_verified: user.email_verified,
                picture: user.picture,
                user_metadata: {
                    picture: user.picture,
                    telephone: user.user_metadata.telephone,
                },
                app_metadata: {
                    acceptedTerms: user.app_metadata.acceptedTerms,
                    allowedSlots: user.app_metadata.allowedSlots,
                    roles: user.app_metadata.roles,
                    laundryBuilding: user.app_metadata.building,
                },
                updated_at: user.updated_at.toString()
            }
        })
    }


    static async userChangePasswordEmail(email: string) {
        return await this.auth_management.database.changePassword({
            email: email,
            connection: 'Username-Password-Authentication'
        })
    }
}

export default Auth0API;