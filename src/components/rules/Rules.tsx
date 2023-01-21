//Imoprt
import { Button, Drawer, List, ListItem, Popper, SwipeableDrawer, Tooltip, Typography } from "@mui/material"
import { Box } from "@mui/system";
import { useState } from "react";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';


interface Props {

}

const Rules = (props: Props) => {
    const [drawerOpen, setdrawerOpen] = useState<boolean>(false);


    const toggleDrawer = () => {
        setdrawerOpen(!drawerOpen);
    }


    const ruleText = (
        <Typography variant={'button'} sx={{ textOrientation: 'upright', writingMode: 'vertical-lr' }}>
            Regler
        </Typography>
    )

    return (

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {!drawerOpen && <Tooltip
                placement={'right'}
                title={<> <KeyboardDoubleArrowRightIcon /></>}
            >
                <Button
                    variant={'outlined'}
                    onClick={toggleDrawer}
                    sx={{
                        display: { md: "inline-flex" },
                        color: '#000000a6',
                        borderColor: '#000000a6',
                        zIndex: 'tooltip',
                        padding: 1,
                        minWidth: 40,
                        left: 0,
                        top: '40%',
                        position: 'fixed'
                    }}
                >

                    {ruleText}
                </Button>
            </Tooltip>}
            <SwipeableDrawer
                PaperProps={{
                    sx: {
                        width: 300
                    }
                }}
                open={drawerOpen}
                onClose={toggleDrawer}
                onOpen={toggleDrawer}
            >
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
            </SwipeableDrawer>
        </Box>
    )
}

export default Rules;