import * as React from 'react';
import { Typography, Box,  Toolbar, AppBar, Fade, Collapse } from '@mui/material';
import Menu from '@mui/material/Menu';
import IconButton from "@mui/material/IconButton";
import { useUser } from '@auth0/nextjs-auth0/client';
import { AccountCircle, Scale } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginButton from './LoginButton';
import ProfileButton from './ProfileButton';
import HomeButton from './HomeButton';
import Image from "next/image"
import {Fab} from "@mui/material"
import { Spin as Hamburger } from 'hamburger-react'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Header = () => {
    const home = process.env.AUTH0_BASE_URL
    const HEADER_IMAGE_PATH = "/LN24_w.svg"
    const HEADER_IMAGE_SCALE = 2
    const HEADER_IMAGE_SIZE = 24 * HEADER_IMAGE_SCALE
    const { user, isLoading, error } = useUser()
    const [menuOpen, setMenuOpen ] = React.useState(false)
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true)
    };
    const handleClose = () => {
        setAnchorEl(null);
        setMenuOpen(false)
    };



    return (
        <div style={{paddingRight:0}}>
        <Box sx={{ alignItems: "top", height:80,paddingRight:0}}>
            <AppBar position="sticky" color="primary">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        href="/"
                    >   
                            <Image alt="header_button" width={HEADER_IMAGE_SIZE} height={HEADER_IMAGE_SIZE} src={HEADER_IMAGE_PATH}/>
                        
                    </IconButton>

                    {user ?
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Tvättbokning NH&GH
                        </Typography>

                        :
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Du är utloggad
                        </Typography>
                    }
                     {user?.name=="admin" && <Fab variant="extended" color="secondary" aria-label="add" href="/admin">
                    <AdminPanelSettingsIcon/>
                        <Typography sx={{display : {xs : "none", sm:"block"}}}>Admin</Typography>
                    </Fab>}
                    {auth && (
                        <><IconButton
                            sx={{ borderRadius: 10 }}
                            aria-label="account of current user"
                            disableRipple
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit">
                                    <Hamburger toggled={menuOpen} size={24}/>                           
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
                                    

                                    <HomeButton/>
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
        </div>
    )

};

export default Header;