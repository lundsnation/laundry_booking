import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import { NextPage } from "next";
import NotLoggedIn from "../src/components/NotLoggedIn";
import ProfileBox from "../src/components/ProfileBox";
import ProfileBooked from "../src/components/ProfileBooked";






const Profile: NextPage = () => {
    const { user, isLoading, error } = useUser()
    return (
        <Grid container columns={2} minWidth={"75%"} spacing={2}>
            <Grid item xs={2} md={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography variant="h2">NH0000</Typography>
            </Grid>
            <Grid item xs={2} md={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <ProfileBox />
            </Grid>
            <Grid item xs={2} md={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <ProfileBooked />
            </Grid>
        </Grid>


    )
}


export default Profile