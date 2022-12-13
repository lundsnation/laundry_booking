import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../src/createEmotionCache';
import { UserProvider } from '@auth0/nextjs-auth0';
import theme from "../src/theme"
import { makeStyles, Paper, alpha, Grid } from '@mui/material';
import Layout from '../src/components/Layout';



// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
// Theme for Lunds Nation as specified in the design handbook
const lundsNationtheme = createTheme({
  typography: {
    allVariants: {
      fontFamily: [
        'Montserrat'
      ].join(",")
    },
  },
  palette: {
    primary: {
      // Laurel
      main: '#6E8F68'
    },
    secondary: {
      // Brick Red
      main: '#F9D483'
    },
    background: {
      // Bianca
      default: "F7F3E6"
    },
  }
});


interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <UserProvider>

      <CacheProvider value={emotionCache}>

        <Head>

          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="viewport" content="initial-scale=1, width=device-width" />

        </Head>
        <ThemeProvider theme={lundsNationtheme}>

          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          {/* <Layout> */}

          <Component {...pageProps} />
          <CssBaseline />

          {/* </Layout> */}


        </ThemeProvider>
      </CacheProvider>
    </UserProvider >

  );
}

