import { Box, Button, Container, Typography } from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import { NextPage } from "next";
import { getUsers } from "../src/getAuth0Users";
import NotLoggedIn from "../src/components/NotLoggedIn";
import { useEffect } from "react";



const Dev: NextPage = () => {

    const { user, isLoading, error } = useUser()
    const userGetter = new getUsers()
    let isDev = false
    useEffect(() => {
        const getDev = async () => {
            const currentUser = await userGetter.getUser("name", (user?.name as string))
            const getDev: boolean = currentUser.app_metadata.isDev
            switch (getDev) {
                case true:
                    isDev = true
                    break;
            }

        }
    })

    const handleClick = async () => {
        const adam = await userGetter.getAllUsers
        console.log(adam)
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