import { SnackInterface } from "../Snack";
import { Dialog, DialogActions, DialogTitle, DialogContent, Divider, Typography, Grid, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { UserType } from "../../../utils/types";


interface props{
    showPasswordChangeDialog : boolean,
    setshowPasswordChangeDialog : (obj:boolean) => void,
    user : UserType,
    setSnack : (state:SnackInterface) => void
}

const ChangePasswordDialog = (props:props) => {
    const [loading,setLoading] = useState(false)
    const {showPasswordChangeDialog,setshowPasswordChangeDialog,user,setSnack,} = props


    const handlePasswordChange = async () =>{
        setLoading(true)
        const response = await fetch("/api/user/changePassword", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email:user?.email})
        })
        if(response?.ok){
            setSnack({show:true, snackString: "Mail om ändring av lösenord skickat!", severity: "success"})
            setshowPasswordChangeDialog(false)
        }else{
            setSnack({show:true, snackString: await response.json(), severity: "error"})
        }
        setLoading(false)
    }

    return(
        <Dialog 
            open={showPasswordChangeDialog} 
            onClose = {()=>{setshowPasswordChangeDialog(false)}}
        >
            <DialogTitle> Ändra lösenord</DialogTitle>
                <Divider variant="middle"/>
            <DialogContent>
                <Typography> Är du säker att du vill ändra lösenord? <br/>Ett mail med instruktioner kommer att skickas till {user?.email} </Typography>
            </DialogContent>
            <DialogActions>
                <Grid  container alignItems='center' justifyContent='center'>
                    <Grid item>
                        <Button sx={{margin:"12px",marginTop:0}} color='warning' variant="outlined" onClick={()=>{setshowPasswordChangeDialog(false)}}>Nej</Button>
                    </Grid>
                    <Grid item>
                        <LoadingButton type="submit" loading={loading} variant="outlined" color='primary' sx={{margin:"12px",marginTop:0}}onClick={handlePasswordChange}>Ja</LoadingButton>
                    </Grid>
                </Grid>
                
            </DialogActions>

        </Dialog>
    )
}
export default ChangePasswordDialog;