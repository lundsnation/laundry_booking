import Header from "./header/Header"
import Footer from "./Footer"
import { Grid } from "@mui/material"
import React from "react"
import User from "../../classes/User"



const img = "/logotyp02.png"


const styles = {
    paperContainer: {
        backgroundImage: `url(${img})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        width: '100%',
        boxShadow: "none",
        justifyContent: "center",
        alignContent: "center",
        alignItems: 'center',
        //display: "flex", //This property ruins the admin page.
        opacity: "1",
        flexGrow: 1,
        my: 3,
        display: { xs: 'block', sm: 'flex' } //This is to ensure that block view is added to mobile and therefore not ruining mobile view of admin page.
    }
}

interface Props {
    children: React.ReactNode
    user: User
}

export default function Layout({ children, user }: Props) {

    return (
        <Grid container
            sx={{
                minHeight: "100vh",
                flexDirection: 'column',
                width: '100%',
            }}
        >
            <Header user={user} />

            <Grid sx={styles.paperContainer}>
                <main> {children} </main>
            </Grid>

            <Footer />
        </Grid>
    )
}