import { TextField, Button, List, Grid, Paper, ListItem, Typography } from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/client';
import { NextPage } from "next";
import NotLoggedIn from "../src/components/NotLoggedIn";
import ProfileBox from "../src/components/profile/ProfileBox";
import ProfileBooked from "../src/components/profile/ProfileBooked";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";

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
    const [loading, setLoading] = useState()
    return (
        <Grid container>

            <Grid item xs={12} minHeight={100} flexGrow={1}>
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
                    <Paper sx={{minWidth : "50%"}}>
                        <Typography sx={{margin: "16px",mb:0}}variant="h4" >
                            Ändra {user?.name}
                        </Typography>
                        <List>
                            <ListItem>
                            <TextField
                                fullWidth
                                label="E-Post"
                                type="email"
                                variant="outlined"
                                margin="dense"
                            />
                            </ListItem>
                            <ListItem>
                            <TextField
                                fullWidth
                                label="Telefon"
                                type="tel"
                                variant="outlined"
                                margin="dense"
                            />
                            </ListItem>
                        </List>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <LoadingButton color="warning" variant="outlined" >
                                    Tillbaka
                                </LoadingButton>
                                <LoadingButton variant="outlined" sx={{margin: "16px"}}type="submit" >
                                    Spara
                                </LoadingButton>
                            </Grid>
                        </Grid>
                        
                        </Paper>
                </Paper>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
                <Footer />
            </Grid>

        </Grid >


    )
}


export default Profile