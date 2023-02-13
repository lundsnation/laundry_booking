import * as React from 'react';
import Image from 'mui-image';
import { Container, Typography, Grid, Link } from '@mui/material';


const Footer = () => {

    const groupPic = "/about_pic.png"

    return (
        <Grid container display={"flex"} alignItems={"top"} justifyContent={"center"} padding={4} flexGrow={1}
            sx={{
                backgroundColor: "#afa998", //Får den ej att vilja använda sig av themeProvider t.ex. "secondary"
                color: "#fff",
            }}>

            <Grid item sm={12} md={4} display={"flex"} alignItems={"top"} justifyContent={"center"} paddingX={4}>
                <Grid container >
                    <Grid item sm={12} md={12} display={"flex"}>
                        <Grid item sm={12}>
                            <Typography display={"flex"} alignItems={"top"} justifyContent={"center"} borderBottom={1} fontWeight='bold'>KONTAKT</Typography>
                            <Typography display={"flex"} alignItems={"top"} justifyContent={"center"} fontWeight='medium'>husforman@lundsnation.se </Typography>
                            <Typography display={"flex"} alignItems={"top"} justifyContent={"center"} fontWeight='medium'>0735146065 & 0735146066</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12} sm={4} paddingX={4}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography display={"flex"} alignItems={"top"} justifyContent={"center"} borderBottom={1} sx={{ fontWeight: "bold" }}>ÖPPETTIDER HUSEXPEN </Typography>
                        <Typography display={"flex"} alignItems={"top"} justifyContent={"center"} fontWeight='medium'> Mån & Tors 17.00-18.00</Typography>
                        <Typography display={"flex"} alignItems={"top"} justifyContent={"center"} fontWeight='medium'>Agardhsgatan 1, 223 51, Lund</Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12} sm={4} display={"flex"} alignItems={"top"} justifyContent={"center"} paddingX={4}>
                <Grid container display={"flex"} alignItems={"top"} justifyContent={"center"} rowSpacing={1}>
                    <Grid item xs={12}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        sx={{
                            minWidth: 200,
                            maxWidth: 200
                        }}>

                        <Link href="/about"><Image src={groupPic} alt={"Image Unavailable"} width={200} /></Link>

                    </Grid>
                </Grid>
            </Grid>
        </Grid >
    )
};

export default Footer;