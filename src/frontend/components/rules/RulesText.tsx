import { Box, List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

export const RulesText = () => {

    const fontWeight = 'medium'
    const mx = 3
    return (
        <Box >
            <Typography align="center" variant="h3" padding={2}>
                Regler
            </Typography >
            <Typography variant="body1" align="left" fontWeight={fontWeight} mx={mx}>
                Tvättstugan är det viktigaste gemensamma utrymmet vi har på huset, därför är det extremt
                viktigt att vi alla hjälps åt och att alla tar sitt ansvar när det gäller att hålla det rent och snyggt.
                Att vi har en lokalvårdare som hjälper till att hålla det rent är en bonus som vi ska vara glada
                över.
            </Typography>

            <List sx={{ listStyleType: 'disc', pl: 4 }} >
                <ListItem sx={{ display: 'list-item', py: 0 }}>
                    <ListItemText>
                        <Typography fontWeight={fontWeight} mx={mx}>
                            15 minuter efter avsatt tid är det fritt fram för andra husboende att utnyttja
                            tvättmaskinerna och torkbåsen.
                        </Typography>

                    </ListItemText>
                </ListItem>

                <ListItem sx={{ display: 'list-item', py: 0 }}>
                    <ListItemText>
                        <Typography fontWeight={fontWeight} mx={mx}>
                            4 stycken bokningsbara maskiner och 2 stycken ej bokningsbara stand-by-maskiner
                        </Typography>
                    </ListItemText>
                </ListItem>

                <ListItem sx={{ display: 'list-item', py: 0 }}>
                    <ListItemText>

                        <Typography fontWeight={fontWeight} mx={mx}>
                            Torktumlaren är just nu inte i bruk. När den åter är det kommer det gå att köpa
                            torktumlarpoletter på husexpen.
                        </Typography>
                    </ListItemText>



                </ListItem>

                <ListItem sx={{ display: 'list-item', py: 0 }}>
                    <ListItemText>

                        <Typography fontWeight={fontWeight} mx={mx}>
                            Torkbåsen ska vara tömda 24 timmar efter ditt tvättpass börjat. Om torkbåset inte är tömt kan du hitta kontaktuppgifter till personen på hemsidan.
                            Observera att detta enbart får användas för detta skäl och att kontaktuppgifterna
                            inte får missbrukas.
                        </Typography>
                    </ListItemText>
                </ListItem>

                <ListItem sx={{ display: 'list-item', py: 0 }}>
                    <ListItemText>
                        <Typography fontWeight={fontWeight} mx={mx}>
                            När du är klar med din tvättid bör du se till att tvättstugan lämnas i gott skick.
                        </Typography>
                    </ListItemText>
                </ListItem>

                <ListItem sx={{ display: 'list-item', py: 0 }}>
                    <ListItemText>

                        <Typography fontWeight={fontWeight} mx={mx}>
                            Det är viktigt att inte lägga i för mycket tvättmedel i facket. För mycket tvättmedel
                            resulterar i att avlagring bildas och maskinen behöver servas av en tekniker (dvs.
                            dyrt). Rätt dosering står på tvättmedelspaketet, men det är ALLTID mindre än vad du
                            tror.
                        </Typography>
                    </ListItemText>
                </ListItem>

                <ListItem sx={{ display: 'list-item', py: 0 }}>
                    <ListItemText>

                        <Typography fontWeight={fontWeight} mx={mx}>
                            Felanmäl snarast om något är trasigt, via Hogia eller till husförmännen via mail eller
                            telefon. Sätt en lapp på med “trasig” och skriv dagens datum på maskinen.
                        </Typography>
                    </ListItemText>
                </ListItem>

            </List>

            <Box my={3} mx={mx}>
                <Typography fontWeight={'bold'} >
                    Kontaktuppgifter till husförmännen:
                </Typography >
                <Stack direction='row' alignItems='center' gap={0}>
                    <EmailIcon />
                    <Typography mx={mx}>

                        husforman@lundsnation.se
                    </Typography>
                </Stack>

                <Stack direction='row' alignItems='center' gap={0}>
                    <PhoneIcon />
                    <Typography mx={mx}>
                        0735146065 & 0735146066
                    </Typography>
                </Stack>

            </Box>


            <Typography pb={2} pt={3} mx={mx} align='right' fontWeight='medium' fontStyle='italic'>
                Hyresgäster som inte följer ordningsreglerna kommer inte få använda tvättstugan.
            </Typography>


        </Box >
    )

}

export default RulesText;