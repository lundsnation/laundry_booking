import { Box } from '@mui/material';
import * as React from 'react';
import { UserType } from '../../../../../utils/types';
import MobileAdminButton from './MobileAdminButton';
import MobileMenuButton from './MobileMenuButton';

interface Props {
    user: UserType
}

const MobileNav = (props: Props) => {
    const user = props.user;

    return (
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            {user.app_metadata?.roles?.includes("admin") && <MobileAdminButton />}
            <MobileMenuButton />
        </Box >
    );
}

export default MobileNav;
