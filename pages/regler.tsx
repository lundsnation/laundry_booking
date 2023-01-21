import { Grid, List, ListItem, Paper, Typography, Box } from "@mui/material";
import Header from "../src/components/header/Header";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Footer from "../src/components/Footer";
import Loading from "../src/components/Loading";
import { NextPage } from "next";
import { UserType } from "../utils/types";
import RulesText from "../src/components/rules/RulesText";

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
        opacity: "1"
    }
}

const Rules: NextPage = () => {
    const { user, error, isLoading } = useUser();
    const router = useRouter()

    useEffect(() => {
        if (!(user || isLoading)) {
            router.push('api/auth/login')
        }
    }, [user, isLoading])


    return (user ?
        <Box >
            <Header user={user as UserType} />
            <Grid container justifyContent="center" alignItems="flex-end">
                <Grid pb={4} item xs={12}>
                    <Paper style={styles.paperContainer}>
                        <Grid container alignItems="flex-start" justifyContent="center" margin={2}>
                            <Grid item xs={12} md={6}>
                                <Paper variant="outlined" >

                                    <RulesText />
                                </Paper>
                            </Grid>
                        </Grid>

                    </Paper>
                </Grid >
                <Grid item xs={12}  >
                    <Footer />
                </Grid>
            </Grid >
        </Box> : <Loading />
    )
}
export default Rules