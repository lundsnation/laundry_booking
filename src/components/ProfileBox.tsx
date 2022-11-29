import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { UserProfile, useUser } from "@auth0/nextjs-auth0";
import { getUsers } from "../../utils/getAuth0Users";
import { useEffect, useState } from "react";
import { Height } from "@mui/icons-material";

const ProfileBox = () => {
    const { user, isLoading, error } = useUser()

    return (
        <Paper variant={'outlined'} sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 300,
            height: 300
        }}>
            <Grid container spacing={1} columns={1}>
                <Grid item xs={"auto"} md={8}>
                    <Typography>Phone number: </Typography>
                    <Typography>Mail:</Typography>
                    <Typography>Mail: </Typography>
                    <Typography>Mail: </Typography>
                    <Typography>Mail: </Typography>
                </Grid>
            </Grid>
        </Paper>
    )
}


export default ProfileBox