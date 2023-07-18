import * as React from 'react';
import { Toolbar, AppBar, Fade, Collapse } from '@mui/material';
import { useRouter } from 'next/router';
import { HeaderLogo } from './HeaderLogo';
import DesktopNav from './desktopNav/DesktopNav';
import MobileNav from './mobileNav/MobileNav';
import { useUser } from '@auth0/nextjs-auth0/client';
import Loading from '../../Loading';
import User from '../../../classes/User';

interface Props {
    user: User;
}


const Header = ({ user }: Props) => {
    const home = process.env.AUTH0_BASE_URL
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
            <AppBar position="fixed" color="primary">

                <Toolbar>
                    <HeaderLogo logoText={"TVÄTT NATIONSHUSET"} />
                    <DesktopNav user={user} />
                    <MobileNav user={user} />
                </Toolbar>
            </AppBar>
            {/* Recommended hack when using postiion="sticky" from MUI docs */}
            <Toolbar disableGutters />
        </React.Fragment>
    )
};

export default Header;