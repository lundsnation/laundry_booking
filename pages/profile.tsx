import { Box, Button, Container, Typography } from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import { NextPage } from "next";
import Header from "../src/components/Header"
import { WithApiAuthRequired } from "@auth0/nextjs-auth0";
import NotLoggedIn from "../src/components/NotLoggedIn";
import ProfileBox from "../src/components/ProfileBox";
import ProfileBooked from "../src/components/ProfileBooked";


const Profile: NextPage = () => {
    const { user, isLoading, error } = useUser()
    return (
        <Container maxWidth="lg">

            {user ?
                <Box sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex"
                }}>
                    <Header />
                    <ProfileBox />
                    <ProfileBooked />
                </Box>
                :
                <NotLoggedIn />

            }
        </Container >
    )
}


export default Profile
