import { NextPage } from "next";
import { Container, Typography, Box,Grid, MenuItem } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from "next/router";

const ProfileButton = () => {
    const { user, isLoading, error } = useUser()
    const router = useRouter()
    return (
                <MenuItem onClick={()=>{router.push("/profile")}}>
                    <Grid container justifyContent="center">
                        <Grid item xs={10}>
                            <Grid container justifyContent="center">
                                <Typography variant="button">Profil</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={2}>
                            <PersonIcon />
                        </Grid> 
                        </Grid>
                    
                </MenuItem>
    )
}

export default ProfileButton