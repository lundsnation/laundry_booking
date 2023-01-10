import { NextPage } from "next";
import {Container, Typography, Box, Button, MenuItem, Grid} from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from "next/router";



const LoginButton: NextPage = () => {
    const {user, isLoading, error} = useUser()
    const pusher = useRouter() 
    return(
            <MenuItem onClick={()=>{pusher.push("api/auth/logout")}}>
                <Grid container justifyContent="center">
                    <Grid item xs={10}>
                        <Grid container justifyContent="center">
                            <Typography variant="button" color="error">Logga ut</Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={2}>
                        <LogoutIcon color="error"/>
                    </Grid> 
                </Grid>   
            </MenuItem>
    )
};

export default LoginButton;