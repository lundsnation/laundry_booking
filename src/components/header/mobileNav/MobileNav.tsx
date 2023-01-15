import { Box } from '@mui/material';
import * as React from 'react';
import MobileAdminButton from './MobileAdminButton';
import MobileMenuButton from './MobileMenuButton';



const MobileNav = () => {

    return (
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <MobileAdminButton />
            <MobileMenuButton />
        </Box >
    );
}

export default MobileNav;
