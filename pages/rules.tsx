import { Grid, List, ListItem, Paper, Typography, Box } from "@mui/material";
import Header from "../src/components/header/Header";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Footer from "../src/components/Footer";
import Loading from "../src/components/Loading";
import { NextPage } from "next";
import { UserType } from "../utils/types";

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
        <Grid container justifyContent="center" alignItems="flex-end">
            <Header user={user as UserType} />
            <Grid item xs={12}>
                <Paper style={styles.paperContainer}>
                    <Grid container alignItems="flex-start" justifyContent="center" margin={2}>
                        <Grid item xs={12} md={6}>
                            <Paper variant="outlined" >
                                <Typography align="center" variant="h2" margin={2}>
                                    Regler
                                </Typography>
                                <Typography margin={2}>
                                    Tvättstugan är det viktigaste gemensamma utrymmet vi har pà huset, därför är det extremt viktigt att alla hjälper till och tar sitt ansvar när det gäller att hälla det rent och snyggt. Vi hoppas frän och med nu att alla hjälper till. Att vi har en lokalvärdare som hjälper till bland är en ren bonus vi ska vara glada över.
                                    <br />
                                    Personer som inte följer ordingsreglerna kommer inte att fá använda tvättstugan.
                                </Typography>
                                <Typography variant="h4" marginLeft={2}>
                                    Generellt
                                </Typography>
                                <List dense>
                                    <ListItem>
                                        Tidsbokning av tvättstugan görs pā www.lundsnation.se/tvatt
                                    </ListItem>
                                    <ListItem>
                                        15 minuter efter avsatt tvättid är det fritt fram för andra husboende att utnyttja tvattpasset.
                                    </ListItem>
                                    <ListItem>
                                        I tvättstugan finns det 4 stycken bokningsbara maskiner och 2 stycken ej bokningsbara.
                                    </ListItem>
                                    <ListItem>
                                        Torktumlarpoletter finns att köpa pä husexpen för 5 kr.
                                    </ListItem>
                                    <ListItem>
                                        Glöm ej att ta bort luddet ur torktumlaren innan och efter torktumling. Torkbäsen ska vara tömda 24 timmar efter ditt tvättpass har börjat.
                                    </ListItem>
                                    <ListItem>
                                        Om torkbäset inte är tömt kan du gä in pâ www.lundsnation.se/tvatt och tryck på infoknappen bredvid en bokad tid för att se lägenhetsnummer och telefonnummer.
                                    </ListItem>
                                </List>
                                <Typography variant="h4" marginLeft={2}>
                                    Maskinråd
                                </Typography>
                                <Typography margin={2}>
                                    Tvättmaskiner, torktumlare och torkrum lämnas avtorkade (glöm ej att torka ovanpå) efter varje tvättpass. Det är även väldigt viktigt att det inte läggs för mycket tvättmedel i facket. För mycket tvättmedel resulterar i att avlagring bildas och maskinen behöver servas av en tekniker (dvs. dyrt). Rätt dosering står på tvättmedelspaketet, men det är ALLTID mindre än vad du tror.
                                    <br />
                                    Felanmäl snarast om någonting är trasigt, antingen via hemsidan eller till husförmännen via telefon. Sätt en lapp med trasig och dagens datum på maskinen.
                                </Typography>

                            </Paper>
                        </Grid>
                    </Grid>

                </Paper>
            </Grid>
            <Grid item xs={12}  >
                <Footer />
            </Grid>
        </Grid> : <Loading />
    )
}
export default Rules