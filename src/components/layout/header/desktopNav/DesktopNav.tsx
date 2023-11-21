import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import router from 'next/router';
import {UserType} from '../../../../../utils/types';
import AdminButton from './DeskAdminButton'
import {Typography} from '@mui/material';
import ProfileMenuButton from './ProfileMenuButton';
import User from "../../../../classes/User"

interface Props {
    user: User
}

type NavItem = {
    navText: string,
    navLink: string
}

//Admin button is added separately as it is special, same with profileButton
const navItems: Array<NavItem> = [
    {navText: 'Boka', navLink: "/"},
    {navText: 'Regler', navLink: "/regler"},
];

const DesktopNav = (props: Props) => {
    const user = props.user

    const onClick = (navLink: string) => {
        router.push(navLink);
    }

    //Borde ha user.role == admin, så kan vilket konto som helst vara ett adminkonto?
    return (
        <Box sx={{display: {xs: 'none', sm: 'block'}}}>
            {navItems.map(({navText, navLink}) => (
                <Button
                    color={"inherit"}
                    key={navText}
                    sx={{mx: 2}}
                    onClick={() => onClick(navLink)}
                >
                    <Typography
                        variant={"h6"}
                        fontSize={16}>
                        {navText}
                    </Typography>
                </Button>
            ))}
            {user.app_metadata.roles.includes("admin") && <AdminButton/>}
            <ProfileMenuButton user={user}/>
        </Box>
    );
}

export default DesktopNav;
