import * as React from 'react';
import type { NextPage } from 'next';
import {Container, Typography, Box, Button} from '@mui/material';
import Link from '../src/Link';
import ProTip from '../src/ProTip';
import Copyright from '../src/Copyright';
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import Login from '../src/components/LoginButton'
import Header from '../src/components/Header'


const Home: NextPage = () => {
  return (

    <Header/>
    
  )
};
export default Home;
