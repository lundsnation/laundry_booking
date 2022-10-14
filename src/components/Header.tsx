import { NextPage } from "next";
import {Container, Typography, Box, Button, Toolbar, AppBar} from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';


const Header: NextPage = () => {
    const {user, isLoading, error} = useUser()
    return(<AppBar>
                {user ? 
                (<Toolbar variant="dense">
                    Välkommen {user.name}
                </Toolbar>) :
                (<Toolbar variant="dense">
                Du är utloggad
                </Toolbar>)}
            </AppBar>)
}

export default Header;