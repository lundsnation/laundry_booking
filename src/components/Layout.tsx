import Header from "./Header"
import Footer from "./Footer"
import { AppBar, Grid, Paper } from "@mui/material"
import React from "react"


const img = 'http://localhost:3000/logotyp02.png'
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

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Grid container rowSpacing={4}>
                <Grid item xs={12} sm={12} md={12} minHeight={100} flexGrow={1}>
                    <Header />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <Paper style={styles.paperContainer}
                        sx={{
                            boxShadow: "none",
                            justifyContent: "center",
                            alignItems: "center",
                            display: "flex",
                            opacity: "1"
                        }}>
                        <main> {children} </main>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <Footer />
                </Grid>
            </Grid>


        </>
    )
}