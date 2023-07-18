import { Typography } from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/client';
import UserGrid from "../src/components/admin/UserGrid";
import { Grid } from "@mui/material";
import Loading from "../src/components/Loading";
import router from "next/router";
import Layout from "../src/components/layout/Layout";
import { UserType } from "../utils/types";
import User from "../src/classes/User";

const Admin = () => {
    const { user, isLoading, error } = useUser()

    if (isLoading) return <Loading />
    if (error) return <div>{error.message}</div>
    if (!user) {
        router.push('/api/auth/login')
        return null
    } else {
        const currentUser = User.fromJSON(user as UserType)
        return (

            <Layout user={currentUser as User}>
                <Grid container justifyContent="center">
                    {user && !isLoading && user.name == "admin" ?
                        <Grid item xs={12} sx={{ px: { xs: 1 } }}>
                            <UserGrid />
                        </Grid> : <Typography variant={'h1'}>Ej auktoriserad</Typography>
                    }
                </Grid>
            </Layout>
        )
    }
}

export default Admin