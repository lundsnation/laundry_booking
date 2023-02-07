import * as React from 'react';
import Image from 'mui-image';
import { Container, Typography, Grid, Link } from '@mui/material';


const Footer = () => {
    const groupPic = "/about_pic.png"


    return (
        <Grid container display={"flex"} alignItems={"top"} justifyContent={"center"} padding={4} rowSpacing={2} spacing={4}
            sx={{
                backgroundColor: "#afa998", //Får den ej att vilja använda sig av themeProvider t.ex. "secondary"
                color: "#fff",
            }}
        >

            <Grid item sm={12} md={4}>
                <Typography borderBottom={1} fontWeight='bold'>KONTAKT</Typography>
                <Typography fontWeight='medium'>husforman@lundsnation.se </Typography>
                <Typography fontWeight='medium'>0735146065 & 0735146066</Typography>
            </Grid>

            <Grid item sm={12} md={4}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography borderBottom={1} sx={{ fontWeight: "bold" }}>EXPEDITION ÖPPETTIDER </Typography>
                        <Typography fontWeight='medium'>Agardhsgatan 1, 223 51, Lund</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography borderBottom={1} sx={{ fontWeight: "bold" }}>NATIONEN </Typography>
                        <Typography fontWeight='medium'>Vardagar 11.00-13.00</Typography>
                        <Typography fontWeight='medium'>Torsdagar 17.00-18.00</Typography>
                        <Typography fontWeight='medium'>Lördagar 13.00-14.00</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography borderBottom={1} sx={{ fontWeight: "bold" }}>HUSET </Typography>
                        <Typography fontWeight='medium'>Arkivet 17.00-18.00</Typography>
                        <Typography fontWeight='medium'>Nationshuset 17.00-18.00</Typography>                    </Grid>
                </Grid>




            </Grid>

            <Grid item sm={12} md={4}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                sx={{
                    minWidth: 300,
                }}
            >

                <Link href="/about"><Image src={groupPic} alt={"Image Unavailable"} width={100} /></Link>

            </Grid>
        </Grid >

    )

};

export default Footer;