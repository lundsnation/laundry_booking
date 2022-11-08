import { NextPage } from "next";
import { Container, Typography, Box, Button } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';

const ProfileButton: NextPage = () => {
    const { user, isLoading, error } = useUser()
    return (
        <Container maxWidth="lg">
            {user && (
                <Box>
                    <Button href="/profile" variant="outlined">
                        Profile
                    </Button>
                </Box>
            )}

        </Container>
    )
}

export default ProfileButton