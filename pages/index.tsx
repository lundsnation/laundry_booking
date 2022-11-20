import * as React from 'react';
import { useEffect } from "react";
import type { NextPage } from 'next';
import {Container, Typography, Box, Button, Grid} from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import Header from '../src/components/Header'
import BookingCalendar from '../src/components/BookingCalendar';
import { useRouter } from 'next/router'



const Home: NextPage = () => {
  const { user, isLoading, error } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!(user || isLoading)) {
      router.push('api/auth/login')
    }
  }, [user, isLoading])

  return( user ? 
   <Container maxWidth="lg">
        <Grid container spacing = {10}>
        <Grid item xs={12}>
            <Header/> 
        </Grid>    
        <Grid item xs={12}>
            {<BookingCalendar title="Tvättbokning - GH/NH" user = {user}/>}
        </Grid> 
        </Grid>       
    </Container> : <Typography>Laddar...</Typography>
   )  
}

export default Home;
