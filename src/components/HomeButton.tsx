import { Container, Typography, Box, Button } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';

const HomeButton = () => {
    const { user, isLoading, error } = useUser()
    return (
        <Container maxWidth="lg">
            {user && (
                <Box>
                    <Button fullWidth href="/" variant="outlined">
                        Hem
                    </Button>
                </Box>
            )}

        </Container>
    )
}

export default HomeButton