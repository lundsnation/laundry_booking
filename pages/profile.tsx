import { Box, Button, Container, Typography } from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import { NextPage } from "next";
import Header from "../src/components/Header"
import { WithApiAuthRequired } from "@auth0/nextjs-auth0";
import NotLoggedIn from "../src/components/NotLoggedIn";


const Profile: NextPage = () => {
    const { user, isLoading, error } = useUser()
    return (
        <Container maxWidth="lg" sx={{ my: "100" }}>
            <Header />
            {user ?

                <Box display={"flex"} alignItems="flex" justifyContent={"center"} my="100px">
                    <Button href="/" variant="outlined">
                        <Typography>Till startsida</Typography>
                    </Button>
                    <Typography sx={{ p: 2 }}>i /Profile</Typography>
                </Box>
                :
                <NotLoggedIn />
            }
        </Container >
    )
}


export default Profile
