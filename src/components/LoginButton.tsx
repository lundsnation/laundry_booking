import { NextPage } from "next";
import {Container, Typography, Box, Button} from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import Header from './Header';



const LoginButton: NextPage = () => {
    const {user, isLoading, error} = useUser()
    return(
        <Container maxWidth="lg">
            { isLoading ? (<Typography> Loading... </Typography>) : 
                <Box>
                    {user ? (
                        <Button fullWidth variant='outlined' href="api/auth/logout">
                            Logga Ut
                        </Button>) : (
                        <Button fullWidth variant='outlined' href="api/auth/login">
                            Logga In
                        </Button>)
                }
                </Box>
            }
                
        </Container>
    )
};

export default LoginButton;