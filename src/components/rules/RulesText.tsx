import { Box, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';

export const RulesText = () => {

    /*
    <List sx={{ listStyleType: 'disc', pl: 4 }} >
        <ListItem sx={{ display: 'list-item' }}>
            <ListItemText>
                15 minuter efter avsatt tid är det fritt fram för andra husboende att utnyttja
                tvättmaskinerna och torkbåsen.
            </ListItemText>
        </ListItem>
        <ListItem sx={{ display: 'list-item' }}>
            <ListItemText>
                4 stycken bokningsbara maskiner och 2 stycken ej bokningsbara stand-by-maskiner
            </ListItemText>
        </ListItem>

    </List>

    */
    /*
    <List>
        <ListItem>
            <ListItemIcon>
                <CircleIcon fontSize="small" sx={{ color: "#000000" }} />
            </ListItemIcon>
            <ListItemText>
                Header
            </ListItemText>
        </ListItem>
        <Typography>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi architecto enim amet, ullam voluptatem qui laudantium! Nulla fugiat voluptatibus optio modi dolores ullam placeat, at hic nobis excepturi ad facilis!
        </Typography>

    </List>
    */

    const fontWeight = 'medium'


    return (
        <Box sx={{ px: 3, mt: 1 }}>
            <Typography py={3} align="center" variant="h3">
                Ordningsregler
            </Typography>
            <Typography sx={{ my: 1 }} variant="body1" align="left" fontWeight={fontWeight}>
                Tvättstugan är det viktigaste gemensamma utrymmet vi har på huset, därför är det extremt
                viktigt att vi alla hjälps åt och att alla tar sitt ansvar när det gäller att hålla det rent och snyggt.
                Att vi har en lokalvårdare som hjälper till att hålla det rent är en bonus som vi ska vara glada
                över.
            </Typography>



            <List sx={{ listStyleType: 'disc', pl: 4 }} >
                <ListItem sx={{ display: 'list-item', py: 0 }}>
                    <ListItemText>
                        <Typography fontWeight={fontWeight}>
                            15 minuter efter avsatt tid är det fritt fram för andra husboende att utnyttja
                            tvättmaskinerna och torkbåsen.
                        </Typography>

                    </ListItemText>
                </ListItem>

                <ListItem sx={{ display: 'list-item', py: 0 }}>
                    <ListItemText>
                        <Typography fontWeight={fontWeight}>
                            4 stycken bokningsbara maskiner och 2 stycken ej bokningsbara stand-by-maskiner
                        </Typography>
                    </ListItemText>
                </ListItem>

                <ListItem sx={{ display: 'list-item', py: 0 }}>
                    <ListItemText>

                        <Typography fontWeight={fontWeight}>
                            Torktumlaren är just nu inte i bruk. När den åter är det kommer det gå att köpa
                            torktumlarpoletter på husexpen.
                        </Typography>
                    </ListItemText>



                </ListItem>

                <ListItem sx={{ display: 'list-item', py: 0 }}>
                    <ListItemText>

                        <Typography fontWeight={fontWeight}>
                            Torktumlaren är just nu inte i bruk. När den åter är det kommer det gå att köpa
                            torktumlarpoletter på husexpen.
                        </Typography>
                    </ListItemText>
                </ListItem>

                <ListItem sx={{ display: 'list-item', py: 0 }}>
                    <ListItemText>

                        <Typography fontWeight={fontWeight}>
                            Torkbåsen ska vara tömda 24 timmar efter ditt tvättpass börjat. Om torkbåset inte är tömt kan du hitta kontaktuppgifter till personen på hemsidan.
                            Observera att detta enbart får användas för detta skäl och att kontaktuppgifterna får
                            inte får missbrukas.
                        </Typography>
                    </ListItemText>
                </ListItem>

                <ListItem sx={{ display: 'list-item', py: 0 }}>
                    <ListItemText>
                        <Typography fontWeight={fontWeight}>
                            När du är klar med tid tvättid bör du se till att tvättstugan lämnas i gott skick.

                        </Typography>
                    </ListItemText>
                </ListItem>

                <ListItem sx={{ display: 'list-item', py: 0 }}>
                    <ListItemText>

                        <Typography fontWeight={fontWeight}>
                            Det är viktigt att inte lägga i för mycket tvättmedel i facket. För mycket tvättmedel
                            resulterar i att avlagring bildas och maskinen behöver servas av en tekniker (dvs.
                            dyrt). Rätt dosering står på tvättmedelspaketet, men det är ALLTID mindre än vad du
                            tror.
                        </Typography>
                    </ListItemText>
                </ListItem>

                <ListItem sx={{ display: 'list-item', py: 0 }}>
                    <ListItemText>

                        <Typography fontWeight={fontWeight}>
                            Felanmäl snarast om något är trasigt, via Hogia eller till husförmännen via mail eller
                            telefon. Sätt en lapp på med “trasig” och skriv dagens datum på maskinen.
                        </Typography>
                    </ListItemText>
                </ListItem>

            </List>

            <Box my={3}>
                <Typography fontWeight={'bold'}>
                    Kontaktuppgifter till husförmännen:
                </Typography>
                <Typography>
                    Mail: husforman@lundsnation.se
                </Typography>
                <Typography>
                    Telefon: 0735146065 och 0735146066
                </Typography>
            </Box>


            <Typography pt={3} align='right' fontWeight='medium' fontStyle='italic'>
                Hyresgäster som inte följer ordningsreglerna kommer inte få använda tvättstugan.
            </Typography>


        </Box >
    )

}

export default RulesText;