import { Grid, List, ListItem, Paper, Typography, Box } from "@mui/material";
import Header from "../src/components/layout/header/Header";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Footer from "../src/components/layout/Footer";
import Loading from "../src/components/Loading";
import { NextPage } from "next";
import { UserType } from "../utils/types";
import RulesText from "../src/components/rules/RulesText";
import Layout from "../src/components/layout/Layout";


const Rules: NextPage = () => {
    const { user, error, isLoading } = useUser();
    const router = useRouter()

    useEffect(() => {
        if (!(user || isLoading)) {
            router.push('api/auth/login')
        }
    }, [user, isLoading])


    return (user ?
        <Layout>

            <Grid container justifyContent="center" py={5}>
                <Grid item xs={12} md={6}>

                    <Paper variant="outlined">
                        <RulesText />
                    </Paper>

                </Grid >
            </Grid >

        </Layout> : <Loading />
    )
}
export default Rules