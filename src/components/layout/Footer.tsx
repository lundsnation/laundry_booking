import * as React from 'react';
import { Container, Typography, Grid } from '@mui/material';


const Footer = () => {
    return (
        <Grid container display={"flex"} alignItems={"top"} justifyContent={"center"} padding={4}
            sx={{
                backgroundColor: "#afa998", //Får den ej att vilja använda sig av themeProvider t.ex. "secondary"
                color: "#fff",
            }}
        >
            <Grid item xs={12} sm={3} mx={4}>
                <Typography borderBottom={1} sx={{ fontWeight: "bold" }}> LUNDS NATION </Typography>
                <Typography fontWeight='medium'>Agardhsgatan 1, 223 51, Lund</Typography>

            </Grid>
            <Grid item xs={12} sm={3} mx={4}>
                <Typography borderBottom={1} fontWeight='bold'>KONTAKT</Typography>
                <Typography fontWeight='medium'>husforman@lundsnation.se </Typography>
                <Typography fontWeight='medium'>0735146065 & 0735146066</Typography>
            </Grid>
            <Grid item xs={12} sm={3} mx={4}>
                <Typography borderBottom={1} fontWeight='bold'>ÖPPETTIDER HUSEXPEN</Typography>
                <Typography fontWeight='medium'>Måndagar & Torsdagar 17.00-18.00</Typography>
            </Grid >
        </Grid >

    )

};

export default Footer;