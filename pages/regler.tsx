import { Grid, List, ListItem, Paper, Typography, Box } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import Loading from "../src/components/Loading";
import { NextPage } from "next";
import RulesText from "../src/components/rules/RulesText";
import Layout from "../src/components/layout/Layout";


const Rules: NextPage = () => {
    const { user, error, isLoading } = useUser();
    const router = useRouter()

    if (isLoading) return <Loading />
    if (error) return <div>{error.message}</div>
    if (!user) {
        router.push('/api/auth/login')
        return null
    } else {
        return (
            <Layout>

                <Grid container justifyContent="center" >
                    <Grid item xs={12} md={6} >

                        <Paper variant="outlined" sx={{ my: { sm: 6 }, mx: { xs: 2 } }}>
                            <RulesText />
                        </Paper>

                    </Grid >
                </Grid >

            </Layout >
        )
    }
}

export default Rules