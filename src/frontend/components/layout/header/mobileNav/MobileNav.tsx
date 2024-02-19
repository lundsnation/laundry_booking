import {Box} from '@mui/material';
import * as React from 'react';
import MobileAdminButton from './MobileAdminButton';
import MobileMenuButton from './MobileMenuButton';
import User from '../../../../classes/User';

interface Props {
    user: User
}

const MobileNav = (props: Props) => {
    const user = props.user;

    return (
        <Box sx={{display: {xs: 'flex', sm: 'none', alignItems: 'center'}}}>
            {user.app_metadata.roles.includes("admin") && <MobileAdminButton/>}
            <MobileMenuButton/>
        </Box>
    );
}

export default MobileNav;
