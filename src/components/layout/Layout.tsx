import Header from "./header/Header"
import Footer from "./Footer"
import { AppBar, Grid, Paper } from "@mui/material"
import React, { useEffect } from "react"
import { useUser } from "@auth0/nextjs-auth0/client"
import { useRouter } from "next/router"
import { UserType } from "../../../utils/types"
import Loading from "../Loading"


const img = process.env.AUTH0_BASE_URL as string + "/logotyp02.png"
const styles = {
    paperContainer: {
        backgroundImage: `url(${img})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',

        width: '100%',

        boxShadow: "none",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        opacity: "1",
        flexGrow: 1,

    }
}

export default function Layout({ children }: { children: React.ReactNode }) {
    const { user, error, isLoading } = useUser();
    const router = useRouter()

    useEffect(() => {
        if (!(user || isLoading)) {
            router.push('api/auth/login')
        }
    }, [user, isLoading])

    return (user ?
        <Grid container
            sx={{
                minHeight: "100vh",
                display: 'flex',
                flexDirection: 'column',
            }}
        >

            <Header user={user as UserType} />

            <Paper sx={styles.paperContainer}>
                <main> {children} </main>
            </Paper>

            <Footer />
        </Grid> : <Loading />

    )
}