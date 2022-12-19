import { Box,List, Button, DialogActions ,Dialog, DialogTitle, ListItem, Typography, Divider } from "@mui/material"
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CallIcon from '@mui/icons-material/Call';
import { Booking, UserType } from "../../utils/types"
import { useState,useEffect } from "react";

interface Props {
    booking: Booking,
    showBookingInfo: boolean,
    showBookedTime: (state:boolean) => void,
    selectedDate: Date
}
const BookingInfo = (props: Props) => {
const {booking, showBookingInfo, selectedDate} = props
const [userInfo,setUserInfo] = useState<UserType>({
    name: "",
    email: "",
    app_metadata: {acceptedTerms: false, allowedSlots: 0, roles:[""]},
    user_metadata: {telephone: ""}
})

 const fetchUser = async ()=>{
        const response = await fetch("/api/user/"+booking.userName)
        if(response.ok){
            const responseContent = await response.json()
            setUserInfo({
            name: responseContent.name,
            email: responseContent.email,
            app_metadata: responseContent.app_metadata,
            user_metadata: responseContent.user_metadata
        })
        console.log("User set: "+ responseContent.name)
    }
}

useEffect(()=>{
    fetchUser()
    console.log("Component mounted with prop: " + booking.userName)
},[booking])

return(
<Dialog onClose = {()=>{props.showBookedTime(false)}}
                            open={showBookingInfo} fullWidth>
                                <DialogTitle> Info om bokning </DialogTitle>
                                <Divider variant="middle"/>
                                <List sx={{ pt: 0 }}>
                                    <ListItem >
                                        Tid bokad av   <Typography style={{paddingLeft: 5, fontWeight: 'bold'}}>{userInfo.name}</Typography>
                                    </ListItem>    
                                    <ListItem>
                                        <CallIcon fontSize = "small" /> <Typography style={{paddingLeft: 5}}>{userInfo.user_metadata.telephone}</Typography>
                                    </ListItem>
                                    <ListItem>
                                        <AlternateEmailIcon fontSize = "small"/> <Typography style={{paddingLeft: 5}}>{userInfo.email}</Typography>
                                    </ListItem>
                                </List>   
                                <DialogActions>
                                    <Typography sx={{fontStyle: "italic", justifyContent: "center", padding: 1}} variant="caption" align= "left">Kom ihåg att hålla god ton mot andra hyrestagare</Typography>
                                    <Box sx={{ mx: 3 }} /> 
                                    <Button onClick={()=>{props.showBookedTime(false)}}>Stäng</Button>
                                </DialogActions>
                            </Dialog>
)}
export default BookingInfo;