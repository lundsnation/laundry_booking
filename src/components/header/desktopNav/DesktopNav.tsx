import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import router from 'next/router';
import { UserType } from '../../../../utils/types';
import AdminButton from './AdminButton'
import { Typography } from '@mui/material';

interface Props {
    user: UserType
}

type navItem = {
    navText: string,
    navLink: string
}

//Admin button is added separately as it is special
const navItems: Array<navItem> = [
    { navText: 'Boka', navLink: "/" },
    { navText: 'Regler', navLink: "/regler" },
    { navText: 'info', navLink: "/info" }
];

const DesktopNav = (props: Props) => {
    const user = props.user

    const onClick = (navLink: string) => {
        router.push(navLink);
    }

    //Borde ha user.role == admin, så kan vilket konto som helst vara ett adminkonto?
    return (
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map(({ navText, navLink }) => (
                <Button
                    key={navText}
                    sx={{ color: '#fff', mx: 2 }}
                    onClick={() => onClick(navLink)}
                >
                    <Typography
                        variant={"h6"}
                        fontSize={16}>
                        {navText}
                    </Typography>
                </Button>
            ))}
            {user.name == "admin" && <AdminButton />}
        </Box >
    );
}

export default DesktopNav;
