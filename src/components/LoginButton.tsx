import { NextPage } from "next";
import {Container, Typography, Box, Button} from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import Header from './Header';



const LoginButton: NextPage = () => {
    const {user, isLoading, error} = useUser()
    return(
        <Container maxWidth="lg">
            { isLoading ? (<Typography> Loading... </Typography>) : 
                <Box>
                    {user ? (
                        <Button variant='outlined' href="api/auth/logout">
                            Logout
                        </Button>) : (
                        <Button variant='outlined' href="api/auth/login">
                            Login
                        </Button>)
                }
                </Box>
            }
                
        </Container>
    )
};

export default LoginButton;