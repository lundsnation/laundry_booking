import * as React from 'react';
import { useEffect, useState } from "react";
import type { NextPage } from 'next';
import { CircularProgress , Typography, Box, Button, Grid, Paper } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import Header from '../src/components/Header'
import BookingCalendar from '../src/components/calendar/BookingCalendar';
import { useRouter } from 'next/router'
import Footer from '../src/components/Footer';



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
    <Grid container rowSpacing={10}>
      <Grid item xs={12} sm={12} md={12} minHeight={100} flexGrow={1}>
        <Header />
      </Grid>

      <Grid item xs={12}>
        <Paper style={styles.paperContainer}
          sx={{
            boxShadow: "none",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            opacity: "1"
          }}>
          {<BookingCalendar title="" user={user} />}
        
        </Paper>

      </Grid>
      
      <Grid item xs={12}>
        <Footer />
      </Grid>

    </Grid>: <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress/>
    </div>
    )
}

export default Index;