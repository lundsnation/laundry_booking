import * as React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';


const Footer = () => {
    return (
        <Grid container display={"flex"} alignItems={"top"} justifyContent={"center"} padding={4}
            sx={{
                backgroundColor: "#afa998", //Får den ej att vilja använda sig av themeProvider t.ex. "secondary"
                color: "#fff",
            }}
        >
            <Grid item xs={12} sm={3} mx={4}>
                <Box borderBottom={1}> Test</Box>
                <Box>Test</Box>
                <Box>Test</Box>
            </Grid>
            <Grid item xs={12} sm={3} mx={4}>
                <Box borderBottom={1}> En till</Box>
                <Box>Också</Box>
            </Grid>
            <Grid item xs={12} sm={3} mx={4}>
                <Box borderBottom={1}> Sista</Box>
                <Box>Japp!</Box>
            </Grid>
        </Grid >

    )

};

export default Footer;