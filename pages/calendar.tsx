import { NextPage } from "next";
import BookingCalendar from '../src/components/BookingCalendar';
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import { Container, Typography, Collapse, Grid } from '@mui/material';
import Header from '../src/components/Header'

const Calendar: NextPage = () => {
    const { user, isLoading, error } = useUser()
    return (

        <Container maxWidth="lg">
            <Grid container spacing={10}>
                <Grid item xs={12}>
                    <Header />
                </Grid>
                <Grid item xs={12}>
                    {user ? <BookingCalendar title="Tvättbokning - Lunds Nation" user={user} /> : <Typography>Logga in!</Typography>}
                </Grid>
            </Grid>
        </Container>
    );
}

export default Calendar;

/*{user ?  <BookingCalendar title="Tvättbokning - Lunds Nation" user = {user}/> : router.push("/index")}*/