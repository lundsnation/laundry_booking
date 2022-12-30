import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/client';
import { NextPage } from "next";
import NotLoggedIn from "../src/components/NotLoggedIn";
import ProfileBox from "../src/components/profile/ProfileBox";
import ProfileBooked from "../src/components/profile/ProfileBooked";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";

const img = process.env.AUTH0_BASE_URL as string + "/logotyp02.png"
const styles = {
    paperContainer: {
        backgroundImage: `url(${img})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
    }
}


const Profile: NextPage = () => {
    const { user, isLoading, error } = useUser()
    return (
        <Grid container rowSpacing={4}>

            <Grid item xs={12} sm={12} md={12} minHeight={100} flexGrow={1}>
                <Header />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Paper style={styles.paperContainer}
                    sx={{
                        boxShadow: "none",
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                    }}>
                    <Grid container columns={2} maxWidth={"65%"} spacing={2}>

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
                </Paper>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
                <Footer />
            </Grid>

        </Grid >


    )
}


export default Profile