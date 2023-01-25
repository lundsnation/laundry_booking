import { Box, Container, Typography, Paper } from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/client';
import NotLoggedIn from "../src/components/NotLoggedIn";
import NotAuthorized from "../src/components/NotAuthorized";
import UserGrid from "../src/components/admin/UserGrid";
import { Grid } from "@mui/material";
import Loading from "../src/components/Loading";
import { UserType } from "../utils/types";
import { useEffect } from "react";
import router from "next/router";
import Layout from "../src/components/layout/Layout";

const Admin = () => {
    const { user, isLoading, error } = useUser()

    useEffect(() => {
        if (!(user || isLoading)) {
            router.push('api/auth/login')
        }
    }, [user, isLoading])


    return (user ?
        <Layout>

            <Grid container justifyContent="center">
                {user && !isLoading ?
                    <Grid item xs={12}>
                        <Box>
                            {user.name == "admin" ?
                                <UserGrid />
                                : <NotAuthorized />
                            }</Box></Grid> : <Loading />
                }
            </Grid>

        </Layout> : <Loading />
    )
}

export default Admin