import { Box, Button, Container, Typography } from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import { NextPage } from "next";
import { getUsers } from "../utils/getAuth0Users";
import NotLoggedIn from "../src/components/NotLoggedIn";
import { useEffect, useState } from "react";


//page is currently visible for all users
const Dev: NextPage = () => {
    const getter = new getUsers
    const { user, isLoading, error } = useUser()



    const handleClick = async () => {
        const all = await getter.downloadAllUsers
        console.log(all)
    }

    return (

        <Container maxWidth="lg">
            {user && !isLoading ?
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

export default Dev