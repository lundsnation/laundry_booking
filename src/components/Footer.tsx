import * as React from 'react';
import { NextPage } from "next";
import { Container, Typography, Box, Button, Toolbar, AppBar, Fade, Collapse } from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";
import Menu from '@mui/material/Menu';
import IconButton from "@mui/material/IconButton";
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import { AccountCircle } from '@mui/icons-material';
import LoginButton from './LoginButton';
import ProfileButton from './ProfileButton';


const Footer = () => {
    const { user, isLoading, error } = useUser()
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <Container maxWidth="lg">
            <Box sx={{ alignItems: "end" }}>
                <AppBar position="fixed" color="primary">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>

                        {user ?
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Välkommen!
                            </Typography>
                            :
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Du är utloggad
                            </Typography>
                        }
                        {auth && (
                            <><IconButton
                                sx={{ borderRadius: 10 }}
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit">
                                <AccountCircle />
                                <Typography
                                    sx={{ m: 1 }}
                                >
                                    {user?.name}
                                </Typography>
                            </IconButton><Box>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}

                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >

                                        <ProfileButton />
                                        <LoginButton />


                                    </Menu>
                                </Box></>
                            //ProfileButton & LoginButton, Buttons in iconMenu
                            //Whether buttons are shown are based on "user" in the components
                        )}

                    </Toolbar>
                </AppBar>
            </Box>
        </Container>
    )

};

export default Footer;