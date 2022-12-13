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
                <Box borderBottom={1} sx={{ fontWeight: "bold" }}> LUNDS NATION </Box>
                <Box>Agardhsgatan 1</Box>
                <Box>hus@lundsnation.se</Box>
            </Grid>
            <Grid item xs={12} sm={3} mx={4}>
                <Box borderBottom={1} sx={{ fontWeight: "bold" }}>ÖPPETTIDER EXPEN</Box>
                <Box>Måndagar & Torsdagar 17.00-18.00</Box>
            </Grid>
        </Grid >

    )

};

export default Footer;