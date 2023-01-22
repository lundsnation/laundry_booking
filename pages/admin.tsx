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
import Header from "../src/components/layout/header/Header";

const Admin = () => {
    const { user, isLoading, error } = useUser()

    useEffect(() => {
        if (!(user || isLoading)) {
            router.push('api/auth/login')
        }
    }, [user, isLoading])


    return (user ?
        <Grid container justifyContent="center">
            <Grid item xs={12} flexGrow={1}>
                <Header user={user as UserType} />
            </Grid>
            {user && !isLoading ?
                <Grid item xs={12}>
                    <Box>
                        {user.name == "admin" ?
                            <UserGrid />
                            : <NotAuthorized />
                        }</Box></Grid> : <Loading />

            }
        </Grid> : <Loading />
    )
}

export default Admin