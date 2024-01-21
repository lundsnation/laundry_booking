import * as React from 'react';
import {Toolbar, AppBar} from '@mui/material';
import {HeaderLogo} from './HeaderLogo';
import DesktopNav from './desktopNav/DesktopNav';
import MobileNav from './mobileNav/MobileNav';
import User from '../../../classes/User';

interface Props {
    user: User;
}


const Header = ({user}: Props) => {
    const [menuOpen, setMenuOpen] = React.useState(false)
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked);
    };
    const logoText = "TVÄTT " + user.app_metadata.laundryBuilding;

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
                    <HeaderLogo logoText={logoText}/>
                    <DesktopNav user={user}/>
                    <MobileNav user={user}/>
                </Toolbar>
            </AppBar>
            {/* Recommended hack when using postiion="sticky" from MUI docs */}
            <Toolbar disableGutters/>
        </React.Fragment>
    )
};

export default Header;