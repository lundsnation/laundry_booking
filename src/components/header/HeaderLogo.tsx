import * as React from 'react';
import Button from '@mui/material/Button';
import { Avatar, Box, Typography } from '@mui/material';
import router from 'next/router';

interface Props {
    logoText: string
}

export const HeaderLogo = (props: Props) => {
    const logoText = props.logoText

    const handleClick = () => {
        router.push("/");
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Button
                color="inherit"
                aria-label="menu"
                sx={{
                    mr: 2,
                }}
                onClick={handleClick}
                variant="text"
                startIcon={
                    <Avatar src={
                        'https://lundsnation-git-preview-lundsnation.vercel.app/LN24_w.svg'
                    } />}
            >
                <Typography
                    sx={{ flexGrow: 1 }}
                    variant="h6">
                    {logoText}
                </Typography>
            </Button>
        </Box>
    );
}