import {Modal, Typography, Box, Button, Grid, Divider} from "@mui/material"
import {useState} from "react"
import {LoadingButton} from "@mui/lab";
import {EmailOutlined, Place} from "@mui/icons-material";
import User from "../classes/User";
import {getSession} from "@auth0/nextjs-auth0";

const USER_AGREEMENT_MAIN_TITLE = "Användarvillkor"
const USER_AGREEMENT_TITLE_1 = "GDPR"
const USER_AGREEMENT_TEXT_1 = "Lunds Nation behandlar personuppgifter när vi måste göra det enligt gällande lagstiftning inom våra olika verksamhetsområden eller när det behövs för att utföra den uppgift som avses (t.ex. för att kunna ge dig bättre service). Vi samlar in dina uppgifter i syfte att skapa ett personligt konto åt dig på vår tvättbokningshemsida. "
const USER_AGREEMENT_TEXT_1_FINE_PRINT = " *Telefonnummer och mail kommer att vara synligt för andra användare*"
const USER_AGREEMENT_TITLE_2 = "RÄTT TILL RADERING"
const USER_AGREEMENT_TEXT_2 = "I de fall behandlingen av dina personuppgifter grundas på samtycke så har du när som helst rätt att ta tillbaka (återkalla) ditt samtycke som du har lämnat till Lunds Nation. Vid utflytt av bostad raderas alla personuppgifter som du har delgivit till här. För att ta tillbaka (återkalla) ett samtycke, ta kontakt med Lunds Nation Studentbostadshus via de kontaktuppgifter som finns längst ned på denna sida. Du ska då uppge för vilket ändamål du väljer att ta tillbaka ditt samtycke. När du har tagit tillbaka (återkallat) ditt samtycke kommer vi att upphöra att behandla dina personuppgifter för det berörda ändamålet. Du har även rätt att begära radering av dina personuppgifter i samband med återkallande av samtycke. OBS! Om du återkallar ditt samtycke kommer du raderas från tvättbokningshemsidan och därmed inte kunna boka tvättider längre."
const CONTACT_INFO_TITLE = "KONTAKTA OSS"
const CONTACT_INFO_TEXT_1 = "Om du har några frågor eller funderingar om behandlingen av dina personuppgifter, hör gärna av dig till Lunds nation Husförmän:"
const CONTACT_INFO_ADRESS = " Agardhsgatan 1, 223 51 Lund"
const CONTACT_INFO_EMAIL = " husforman@lundsnation.se"


const style = {
    position: {xs: "relative", sm: "fixed"},
    top: {xs: 'none', sm: '50%'},
    left: {xs: 'none', sm: '50%'},
    transform: {xs: 'none', sm: 'translate(-50%, -50%)'},
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    // boxShadow: 24,
    maxHeight: "100vh",
    overflow: 'auto',
    p: 4,
};

interface props {
    user: User
}

export const Terms = (props: props) => {
    const {user} = props
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = (event: any, reason: any) => {
        if (reason && reason == "backdropClick") {
            return;
        }
        setOpen(false)
    }
    const handleAccept = async () => {
        setLoading(true)
        const response = await fetch("/api/auth/accepted")
        const session = await response.json()
        console.log(session.user)

        if (response.ok) {

            setLoading(false)
            window.location.reload()
            // const updatedUser = User.fromJSON(session.user as UserType)
            // handleCurrentUser(updatedUser)
            return
        }

        setLoading(false)
    }
    return (
        <div>
            {user?.app_metadata?.acceptedTerms ? null :
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    disableEscapeKeyDown
                    sx={{overflow: "scroll"}}
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-Title" align="center"
                                    variant="h5">{USER_AGREEMENT_MAIN_TITLE}</Typography>
                        <Box margin={1}/>
                        <Typography id="modal-modal-subtitle1" fontSize="large" variant="h6">
                            {USER_AGREEMENT_TITLE_1}
                        </Typography>
                        <Typography id="modal-modal-description1" variant="body1">
                            {USER_AGREEMENT_TEXT_1}
                        </Typography>
                        <Typography align='right' sx={{fontStyle: 'italic'}}>
                            {USER_AGREEMENT_TEXT_1_FINE_PRINT}
                        </Typography>
                        <Box margin={1}/>
                        <Typography id="modal-modal-subtitle2" fontSize="large" variant="h6">
                            {USER_AGREEMENT_TITLE_2}
                        </Typography>

                        <Typography id="modal-modal-description2" variant="body1">
                            {USER_AGREEMENT_TEXT_2}
                        </Typography>
                        <Box margin={1}/>
                        <Typography id="modal-modal-subtitle-contactinfo" fontSize="large" variant="h6">
                            {CONTACT_INFO_TITLE}
                        </Typography>
                        <Typography id="modal-modal-text-contactinfo">
                            {CONTACT_INFO_TEXT_1}
                        </Typography>
                        <Box margin={1}/>
                        <Grid container spacing={1}>
                            <Grid item>
                                <EmailOutlined/>
                            </Grid>
                            <Grid item>
                                <Typography id="modal-modal-email" fontStyle="italic">
                                    {CONTACT_INFO_EMAIL}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Box margin={1}/>
                        <Grid container spacing={1}>
                            <Grid item>
                                <Place/>
                            </Grid>
                            <Grid item>
                                <Typography id="modal-modal-email" fontStyle="italic">
                                    {CONTACT_INFO_ADRESS}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} justifyContent="center" sx={{mt: 1}}>
                            <Grid item xs="auto">
                                <Button href="api/auth/logout" color="warning" variant="contained">Avböj</Button>
                            </Grid>
                            <Grid item xs="auto">
                                <LoadingButton loading={loading} variant="contained"
                                               onClick={handleAccept}>Acceptera</LoadingButton>
                            </Grid>

                        </Grid>

                    </Box>
                </Modal>
            }
        </div>
    );
}
export default Terms

