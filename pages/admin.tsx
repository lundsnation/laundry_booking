import {Typography} from "@mui/material";
import {withPageAuthRequired, getSession} from '@auth0/nextjs-auth0';
import UserGrid from "../src/components/admin/UserGrid";
import {Grid} from "@mui/material";
import Layout from "../src/components/layout/Layout";
import User, {JsonUser} from "../src/classes/User";
import Auth0 from "../src/classes/Auth0";
import Users from "../src/classes/Users";

interface Props {
    user: JsonUser;
    jsonUsers: string;
}

// ... (other imports and code remain unchanged)

const Admin = ({user, jsonUsers}: Props) => {
    const currentUser = new User(user);

    // Guard protecting the page    
    if (!currentUser.app_metadata.roles.includes('admin')) {
        return (
            <Layout user={currentUser as User}>
                <Typography variant={'h1'}>Ej auktoriserad</Typography>
            </Layout>
        );
    }


    const initUsers = Users.fromJSON(JSON.parse(jsonUsers));
    console.log(initUsers)

    return (
        <Layout user={currentUser}>
            <Grid container justifyContent="center">
                <Grid item xs={12} sx={{px: {xs: 1}}}>
                    <UserGrid user={currentUser} initUsers={initUsers}/>
                </Grid>
            </Grid>
        </Layout>
    );
};

export const getServerSideProps = withPageAuthRequired({
    // returnTo: '/unauthorized',
    async getServerSideProps(ctx) {
        // If session is needed
        const session = await getSession(ctx.req, ctx.res);
        if (!session?.user.app_metadata.roles.includes('admin')) {
            return {
                props: {
                    jsonUsers: JSON.stringify([]), // Use an empty array instead of undefined
                },
            };
        }

        const users = await Auth0.getUsersAsUserType();

        return {
            props: {
                jsonUsers: JSON.stringify(users), // Return jsonUsers instead of users
            },
        };
    },
});

export default Admin;
