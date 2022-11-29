import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import { NextPage } from "next";
import Header from "../src/components/Header"
import { WithApiAuthRequired } from "@auth0/nextjs-auth0";
import NotLoggedIn from "../src/components/NotLoggedIn";
import ProfileBox from "../src/components/ProfileBox";
import ProfileBooked from "../src/components/ProfileBooked";
import logo from "../public/logotyp.png"






const Profile: NextPage = () => {
    const { user, isLoading, error } = useUser()
    return (
        <>

            {user ?
                <Container maxWidth="lg" sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    my: 20,
                    gap: 10

                }}>
                    <Typography variant="h2">
                        {user.name}
                    </Typography>
                    <ProfileBox />
                    <ProfileBooked />
                </Container>
                :
                <NotLoggedIn />}
        </>
    )
}


export default Profile