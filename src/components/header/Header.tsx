import * as React from 'react';
import { Typography, Box, Toolbar, AppBar, Fade, Collapse } from '@mui/material';
import Menu from '@mui/material/Menu';
import IconButton from "@mui/material/IconButton";
import { useUser } from '@auth0/nextjs-auth0/client';
import { AccountCircle, Scale } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginButton from '../LoginButton';
import ProfileButton from '../ProfileButton';
import HomeButton from '../HomeButton';
import Image from "next/image"
import { Fab } from "@mui/material"
import { Spin as Hamburger } from 'hamburger-react'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { HeaderLogo } from './HeaderLogo';
import DesktopNav from './desktopNav/DesktopNav';
import { UserType } from '../../../utils/types';
import MobileNav from './mobileNav/MobileNav';

interface Props {
    user: UserType
}

const Header = (props: Props) => {
    const home = process.env.AUTH0_BASE_URL
    const user = props.user
    const [menuOpen, setMenuOpen] = React.useState(false)
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked);
    };
    const router = useRouter()

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true)
    };
    const handleClose = () => {
        setAnchorEl(null);
        setMenuOpen(false)
    };

    return (
        <React.Fragment>
            <AppBar position="sticky" color="primary">

                <Toolbar>
                    <HeaderLogo logoText={"TVÄTT NH&GH"} />
                    <DesktopNav user={user} />
                    <MobileNav />
                </Toolbar>
            </AppBar>
            {/* Recommended hack when using postiion="sticky" from MUI docs */}
            <Toolbar />
        </React.Fragment>
    )

};

export default Header;