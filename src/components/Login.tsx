import { NextPage } from "next";
import {Container, Typography, Box, Button} from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import Header from '../components/Header';



const Login: NextPage = () => {
    const {user, isLoading, error} = useUser()
    return(
        <Container maxWidth="lg">
            { isLoading ? (<Typography> Loading... </Typography>) : 
                <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                >
                    {user ? (
                        <><Header /><Button variant='outlined' href="api/auth/logout">
                            Logout
                        </Button></>) : (
                        <><Header /><Button variant='outlined' href="api/auth/login">
                                Login
                        </Button></>)
                }
                </Box>
            }
                
        </Container>
    )
};

export default Login;