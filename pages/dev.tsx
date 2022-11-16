import { Box, Button, Container, Typography } from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import { NextPage } from "next";
import { getUsers } from "../utils/getAuth0Users";
import NotLoggedIn from "../src/components/NotLoggedIn";
import { useEffect } from "react";



const Dev: NextPage = () => {

    const { user, isLoading, error } = useUser()
    const userGetter = new getUsers()

    const handleClick = async () => {
        const adamDev = await userGetter.checkForPrivliges("name", "NH1105")
        console.log(adamDev)
    }

    return (

        <Container maxWidth="lg">
            {user ?
                <Box>
                    <Typography>
                        /dev
                    </Typography>
                    <Button onClick={handleClick}>request users</Button>
                </Box>
                :
                <NotLoggedIn />
            }
        </Container>
    )
}

export default Dev;