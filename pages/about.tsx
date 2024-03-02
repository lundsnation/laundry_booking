import {useUser} from "@auth0/nextjs-auth0/client";
import {Grid, Paper} from "@mui/material";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {AboutText} from "../src/frontend/components/about/AboutText";
import Layout from "../src/frontend/components/layout/Layout";
import Loading from "../src/frontend/components/Loading";
import User, {JsonUser} from "../src/frontend/models/User";

const About: NextPage = () => {
    const {user, isLoading, error} = useUser()
    const router = useRouter()

    if (isLoading) return <Loading/>
    if (error) return <div>{error.message}</div>
    if (!user) {
        router.push('/api/auth/login')
        return null
    } else {
        return (
            <Layout user={new User(user as JsonUser)}>
                <Grid container justifyContent="center">
                    <Grid item sm={12} md={8}>

                        <Paper variant="outlined" sx={{my: {sm: 6}, mx: {xs: 2}}}>
                            <AboutText/>
                        </Paper>

                    </Grid>
                </Grid>
            </Layout>
        )
    }
}

export default About;