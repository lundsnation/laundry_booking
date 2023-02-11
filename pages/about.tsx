import { useUser } from "@auth0/nextjs-auth0/client";
import { Grid, Paper } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AboutText } from "../src/components/about/AboutText";
import Layout from "../src/components/layout/Layout";
import Loading from "../src/components/Loading";

const About: NextPage = () => {
    const { user, isLoading, error } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (!(user || isLoading)) {
            router.push('api/auth/login')
        }
    }, [user, isLoading])

    return (user ?
        <Layout>
            <Grid container justifyContent="center" >
                <Grid item sm={12} md={8} >

                    <Paper variant="outlined" sx={{ my: { sm: 6 }, mx: { xs: 2 } }}>
                        <AboutText />
                    </Paper>

                </Grid >
            </Grid >
        </Layout> : <Loading />
    )
}

export default About;