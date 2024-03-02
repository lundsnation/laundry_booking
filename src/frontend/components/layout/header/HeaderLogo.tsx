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
                onClick={handleClick}
                variant="text"
                startIcon={
                    <Avatar
                        src={'/LN24_w.svg'}
                    />
                }
            >
                <Typography
                    sx={{
                        flexGrow: 1,
                        display: { xs: 'none', sm: 'none', md: 'block' }
                    }}
                    variant="h6"
                >

                    {logoText}
                </Typography>

                <Typography
                    sx={{
                        flexGrow: 1,
                        display: { sm: 'block', md: 'none' }
                    }}
                    variant="h6"
                    fontSize={13}
                >

                    {logoText}
                </Typography>

            </Button>
        </Box >
    );
}