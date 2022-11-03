import { Box, Button, Container, Typography } from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import { NextPage } from "next";
import Header from "../src/components/Header"


const Profile: NextPage = () => {
    const { user, isLoading, error } = useUser()
    return (
        <Container maxWidth="lg">
            <Header />
            {user ?

                <Box display={"flex"} alignItems="flex" justifyContent={"center"} my="100px">
                    <Button href="/" variant="outlined">
                        <Typography>Till startsida</Typography>
                    </Button>
                    <Typography sx={{ p: 2 }}>i /Profile</Typography>
                </Box>
                :
                <><><Box display="flex" sx={{
                    justifyContent: "center"
                }}>
                    <Typography>Du är utloggad</Typography>
                </Box><Box display="flex" sx={{
                    justifyContent: "center"
                }}>
                        <Button href="/">Tillbaka till start</Button>
                    </Box>
                    <Box display="flex" sx={{
                        justifyContent: "center"
                    }}>
                        <Button href="/api/auth/login">Logga in</Button>
                    </Box>
                </><Box
                    display="flex"
                    sx={{
                        justifyContent: "center",
                        minWidth: 100,
                        padding: 2

                    }}
                    alignItems="flex"

                >
                        <Typography sx={{ height: 100 }} align="center">Test</Typography>
                    </Box></>
            }
        </Container >
    )
}


export default Profile
