import { NextPage } from "next";
import { Container, Typography, Box, Button } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';

const ProfileButton = () => {
    const { user, isLoading, error } = useUser()
    return (
        <Container maxWidth="lg">
            {user && (
                <Box>
                    <Button fullWidth href="/profile" variant="outlined">
                        Profil
                    </Button>
                </Box>
            )}

        </Container>
    )
}

export default ProfileButton