import * as React from 'react';
import { useEffect, useState } from "react";
import type { NextPage } from 'next';
import { CircularProgress , Typography, Box, Button, Grid, Paper } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import Header from '../src/components/Header'
import BookingCalendar from '../src/components/calendar/BookingCalendar';
import { useRouter } from 'next/router'
import Footer from '../src/components/Footer';
import Terms from '../src/components/Terms';
import { UserType } from '../utils/types';
import Loading from '../src/components/Loading';

const img = process.env.AUTH0_BASE_URL as string + "/logotyp02.png"
const styles = {
  paperContainer: {
    backgroundImage: `url(${img})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    height: '100vh',
    width: '100%',
  }
}


const Index = () => {
  //const { user, isLoading, error } = useUser()
  const { user, error, isLoading } = useUser();
  const router = useRouter()

  useEffect(() => {
    if (!(user || isLoading)) {
      router.push('api/auth/login')
    }
  }, [user, isLoading])

  return (user ?
    // Mobile compability hack
    <Grid container rowSpacing={{xs : 14, sm: 0}}  sx={{paddingRight:0}}justifyContent="flex-end" >
      <Terms user={user as UserType}/>
      <Grid item xs={12}  minHeight={100} >
        <Header />
      </Grid>

      <Grid item xs={12} flexGrow={1} >
        <Paper style={styles.paperContainer}
          sx={{
            minHeight: 0,
            boxShadow: "none",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            opacity: "1"
          }}>
            
          {<BookingCalendar title="" user={user as UserType} />}
        
        </Paper>

      </Grid>
      
      <Grid item xs={12}  >
        <Footer />
      </Grid>

    </Grid>:<Loading/>
    )
}

export default Index;