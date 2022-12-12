import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { UserProfile, useUser } from "@auth0/nextjs-auth0";
import { getUsers } from "../../utils/getAuth0Users";
import { useEffect, useState } from "react";

const ProfileBooked = () => {
    const { user, error, isLoading } = useUser()


    return (
        <Paper variant={"elevation"} sx={{
            width: 300,
            height: 300,
            justifyContent: "center",
            alignItems: "center",
            display: "flex"
        }}>
            <Grid container spacing={1} columns={1}>
                <Grid item xs={"auto"} md={8}>
                    <Typography variant={"h2"}>Test</Typography>
                </Grid>
            </Grid>
        </Paper >
    )
}

export default ProfileBooked;