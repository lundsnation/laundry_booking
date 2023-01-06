import { Container, Typography,Grid, Button, MenuItem } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import Link from 'next/link';
import {useRouter} from 'next/router';

const HomeButton = () => {
    const router = useRouter()
    const { user, isLoading, error } = useUser()
    return (
                    <MenuItem onClick={()=>{router.push("/")}}>
                                <Grid item xs={10}>
                                    <Grid container justifyContent="center">
                                        <Typography variant="button">Boka </Typography>
                                    </Grid>
                                </Grid>
                        
                        <Grid item xs={2}>
                            <LocalLaundryServiceIcon />
                        </Grid> 
                    </MenuItem>
    )
}

export default HomeButton