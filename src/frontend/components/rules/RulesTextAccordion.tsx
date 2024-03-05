import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Box} from '@mui/material';

export const RulesText = () => {
    return (
        <Box sx={{px: 'auto'}}>
            <Typography gutterBottom align="center" variant="h2">
                Ordningsregler
            </Typography>

            <Typography gutterBottom variant="body1" align={"center"}>
                Tvättstugan är det viktigaste gemensamma utrymmet vi har på huset, därför är det extremt
                viktigt att vi alla hjälps åt och att alla tar sitt ansvar när det gäller att hålla det rent och snyggt.
                Att vi har en lokalvårdare som hjälper till att hålla det rent är en bonus som vi ska vara glada
                över.
            </Typography>
            <Accordion defaultExpanded={true}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography> #Förlorad tid </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        15 minuter efter avsatt tid är det fritt fram för andra husboende att utnyttja
                        tvättmaskinerna och torkbåsen.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography>#Bokningsbara maskiner</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        4 stycken bokningsbara maskiner och 2 stycken ej bokningsbara stand-by-maskiner
                        Torktumlaren är just nu inte i bruk. När den åter är det kommer det gå att köpa
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                >
                    <Typography>#Torktumlaren</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Torktumlaren är just nu inte i bruk. När den åter är det kommer det gå att köpa
                        torktumlarpoletter på husexpen.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel4a-content"
                    id="panel4a-header"
                >
                    <Typography>#Torkbås</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Torkbåsen ska vara tömda 24 timmar efter ditt tvättpass börjat. Om torkbåset inte är tömt kan du
                        hitta kontaktuppgifter till personen på hemsidan.
                        Observera att detta enbart får användas för detta skäl och att kontaktuppgifterna får
                        inte får missbrukas.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel5a-content"
                    id="panel5a-header"
                >
                    <Typography>#Städning</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        När du är klar med tid tvättid bör du se till att tvättstugan lämnas i gott skick.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel6a-content"
                    id="panel6a-header"
                >
                    <Typography>#Dosering</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Det är viktigt att inte lägga i för mycket tvättmedel i facket. För mycket tvättmedel
                        resulterar i att avlagring bildas och maskinen behöver servas av en tekniker (dvs.
                        dyrt). Rätt dosering står på tvättmedelspaketet, men det är ALLTID mindre än vad du
                        tror.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel7a-content"
                    id="panel7a-header"
                >
                    <Typography>#Felanmälan</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Felanmäl snarast om något är trasigt, via Hogia eller till husförmännen via mail eller
                        telefon. Sätt en lapp på med “trasig” och skriv dagens datum på maskinen.
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}

export default RulesText;