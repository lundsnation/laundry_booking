import { useUser } from "@auth0/nextjs-auth0/client";
import { Grid, Paper } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { AboutText } from "../src/components/about/AboutText";
import Layout from "../src/components/layout/Layout";
import Loading from "../src/components/Loading";
import { UserType } from "../utils/types";

const About: NextPage = () => {
    const { user, isLoading, error } = useUser()
    const router = useRouter()

    if (isLoading) return <Loading />
    if (error) return <div>{error.message}</div>
    if (!user) {
        router.push('/api/auth/login')
        return null
    } else {
        return (
            <Layout user={user as UserType}>
                <Grid container justifyContent="center" >
                    <Grid item sm={12} md={8} >

                        <Paper variant="outlined" sx={{ my: { sm: 6 }, mx: { xs: 2 } }}>
                            <AboutText />
                        </Paper>

                    </Grid >
                </Grid >
            </Layout>
        )
    }
}

export default About;