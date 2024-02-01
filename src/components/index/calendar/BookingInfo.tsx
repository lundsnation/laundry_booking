import {
    List,
    Button,
    DialogActions,
    Dialog,
    DialogTitle,
    ListItem,
    Typography,
    Divider,
    Skeleton,
    Grid
} from "@mui/material"
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CallIcon from '@mui/icons-material/Call';
import {UserType} from "../../../../utils/types"
import {useState, useEffect} from "react";
import Booking from "../../../classes/Booking";

interface Props {
    booking: Booking,
    showBookingInfo: boolean,
    setShowBookingInfo: (state: boolean) => void
}

const BookingInfo = (props: Props) => {
    const [loading, setLoading] = useState(false)
    const {booking, showBookingInfo, setShowBookingInfo} = props
    const [userInfo, setUserInfo] = useState<UserType>({} as UserType)

    useEffect(() => {
        if (showBookingInfo) {
            showBookedTime()
        }
    }, [showBookingInfo])

    const showBookedTime = async () => {
        setLoading(true)
        //Fixa med Adams nya klass
        const response = await fetch("/api/user/" + booking?.userName)
        if (response.ok) {
            try {
                const responseContent = await response.json()
                setUserInfo({...responseContent})
            } catch (error) {
                console.log(error)
            }
        }
        setLoading(false)
    }

    return (
        <Dialog onClose={() => {
            setShowBookingInfo(false)
        }}
                open={showBookingInfo} fullWidth>
            <DialogTitle> Info om bokning </DialogTitle>
            <Divider variant="middle"/>
            <List>
                <ListItem>
                    Tid bokad av &nbsp;{loading ? <Skeleton width={80}/> :
                    <Typography style={{fontWeight: 'bold'}}>{userInfo.name}</Typography>}
                </ListItem>
                <ListItem>
                    <CallIcon fontSize="small"/>  &nbsp; {loading ? <Skeleton width={150}/> :
                    <Typography style={{paddingLeft: 5}}>{userInfo.user_metadata?.telephone}</Typography>}
                </ListItem>
                <ListItem>
                    <AlternateEmailIcon fontSize="small"/>  &nbsp; {loading ? <Skeleton width={150}/> :
                    <Typography style={{paddingLeft: 5}}>{userInfo.email}</Typography>}
                </ListItem>
            </List>
            <DialogActions>
                <Grid container padding={2}>
                    <Grid item xs={8}>
                        <Typography sx={{fontStyle: "italic"}} variant="caption">Kom ihåg att hålla god ton mot andra
                            hyrestagare</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Button onClick={() => {
                            setShowBookingInfo(false)
                        }}>Stäng</Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}
export default BookingInfo;