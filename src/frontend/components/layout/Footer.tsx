import React from 'react';
import { Grid, Typography } from '@mui/material';

const Footer = () => {

    return (
        <Grid
            container
            display="flex"
            alignItems="top"
            justifyContent="center"
            padding={5}
            sx={{
                backgroundColor: "#afa998",
                color: "#fff",
            }}
        >
            <Grid item sm={12} md={4} paddingX={4}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" borderBottom={1} sx={{ fontWeight: "bold" }}>
                            KONTAKT
                        </Typography>
                        <Typography variant="body1" align="center" fontWeight="medium">
                            husforman@lundsnation.se
                        </Typography>
                        <Typography variant="body1" align="center" fontWeight="medium">
                            0735146065 & 0735146066
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12} sm={4} paddingX={4}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" borderBottom={1} sx={{ fontWeight: "bold" }}>
                            ÖPPETTIDER HUSEXPEDITIONEN
                        </Typography>
                        <Typography variant="body1" align="center" fontWeight="medium">
                            Mån & Tors 17.00-18.00
                        </Typography>
                        <Typography variant="body1" align="center" fontWeight="medium">
                            Agardhsgatan 1, 223 51, Lund
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Footer;
