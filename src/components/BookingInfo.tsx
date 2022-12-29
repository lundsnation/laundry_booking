import { Box,List, Button, DialogActions ,Dialog, DialogTitle, ListItem, Typography, Divider,Skeleton } from "@mui/material"
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CallIcon from '@mui/icons-material/Call';
import { Booking, UserType } from "../../utils/types"
import { useState,useEffect } from "react";

interface Props {
    booking: Booking,
    showBookingInfo: boolean,
    showBookedTime: () => void,
    user: UserType,
    loading: boolean
}
const BookingInfo = (props: Props) => {
    const {booking, showBookingInfo,user,showBookedTime,loading} = props
    const [userInfo,setUserInfo] = useState<UserType>({} as UserType)
    
    return(
    <Dialog onClose = {()=>{showBookedTime()}}
                                open={showBookingInfo} fullWidth>
                                    <DialogTitle> Info om bokning </DialogTitle>
                                    <Divider variant="middle"/>
                                    <List >
                                        <ListItem >
                                            Tid bokad av &nbsp;{loading ? <Skeleton width={80} />:<Typography style={{fontWeight: 'bold'}}>{user.name}</Typography>}
                                        </ListItem>    
                                        <ListItem>
                                            <CallIcon fontSize = "small" />  &nbsp; {loading ? <Skeleton width={150} />:<Typography style={{paddingLeft: 5}}>{user.user_metadata?.telephone}</Typography>}
                                        </ListItem>
                                        <ListItem>
                                            <AlternateEmailIcon fontSize = "small"/>  &nbsp; {loading? <Skeleton width={150} />:<Typography style={{paddingLeft: 5}}>{user.email}</Typography>}
                                        </ListItem>
                                    </List>   
                                    <DialogActions>
                                        <Typography sx={{fontStyle: "italic", justifyContent: "center", padding:2}} variant="caption" align= "left">Kom ihåg att hålla god ton mot andra hyrestagare</Typography>
                                        <Box  /> 
                                        <Button onClick={()=>{showBookedTime()}}>Stäng</Button>
                                    </DialogActions>
                                </Dialog>
    )}
export default BookingInfo;