import {  Button, Grid, Dialog, DialogActions, DialogTitle,List,ListItem,Divider, TextField,MenuItem} from "@mui/material";
import { useEffect, useState } from "react";
import { UserType } from "../../../utils/types";
import AddIcon from '@mui/icons-material/Add';
import { SnackInterface } from "../Snack";
import { LoadingButton } from "@mui/lab";

interface Props {
    showAddDialog: boolean,
    setShowAddDialog: (state:boolean) => void,
    snack: SnackInterface,
    setSnack : (snackState: SnackInterface) => void,
    fetchUsers : () => void,
}

const NewUserDialog = (props: Props) => {
    const {showAddDialog,setShowAddDialog,snack,setSnack,fetchUsers} = props 
    const [newUser,setNewUser] = useState<UserType>({} as UserType)
    const [newUserApt, setNewUserApt] = useState("")
    const [newUserBulding, setNewUserBuilding] = useState("")
    const [wait, setWait] = useState(false);

    const handleAddUser = async () =>{
        setWait(true)
        const response = await fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...newUser, 
                app_metadata : {...newUser.app_metadata, acceptedTerms: false, roles:['user']}}
                )
        });
        setWait(false);
        
        if(response.ok){
            setSnack({show: true, snackString : "Skapade "+ newUser.name, severity :  'success'})
            setNewUser({} as UserType)
            setNewUserBuilding("")
            setNewUserApt("")
            setShowAddDialog(false)
            fetchUsers()
            return
        }
        setSnack({show: true, snackString :"Det gick inte att skapa användaren", severity : "error"})
    }

    // Updates newUser object whenever newUserApt or newUserBuilding changes
    useEffect(()=>{
        setNewUser({...newUser, name: newUserBulding + newUserApt as string})
    },[newUserApt,newUserBulding])

   return(
    <Dialog open={showAddDialog} 
                                onClose = {()=>{setShowAddDialog(false)}}
                                >
                                <DialogTitle> Lägg till ny användare</DialogTitle>
                                <Divider variant="middle"/>
                                <List >
                                    <ListItem >
                                    <TextField
                                        id="select-building"
                                        margin="dense"
                                        select
                                        fullWidth
                                        value = {newUserBulding}
                                        onChange={(e)=>{
                                            setNewUserBuilding(e.target.value)
                                        }}
                                        label="Välj Byggnad"
                                        helperText="Välj Byggnad"
                                        >
                                      <MenuItem key={"NH"} value={"NH"}>
                                            NH
                                      </MenuItem>
                                      <MenuItem key={"GH"} value={"GH"}>
                                            GH
                                      </MenuItem>
                                      </TextField>
                                    </ListItem>    
                                    <ListItem>
                                    <TextField
                                        required
                                        onChange={(e)=>{
                                            setNewUserApt(e.target.value as string)
                                        }}
                                        margin="dense"
                                        fullWidth
                                        id="input-apt-number"
                                        label="Lägenhetsnummer"
                                        helperText="4 siffror"
                                        />
                                    </ListItem>
                                    <ListItem>
                                    <TextField
                                        required
                                        margin="dense"
                                        fullWidth
                                        onChange={(e)=>{
                                            setNewUser({...newUser, user_metadata : {...newUser.user_metadata, telephone: e.target.value}})
                                        }}
                                        id="input-phone-number"
                                        label="Telefon"
                                        helperText="Riktnummer enbart vid utländskt nummer"
                                        />
                                    </ListItem>
                                    <ListItem>
                                    <TextField
                                        required
                                        margin="dense"
                                        fullWidth
                                        onChange={(e)=>{
                                            setNewUser({...newUser, email:e.target.value})
                                        }}
                                        id="input-email"
                                        label="E-post"
                                        />
                                    </ListItem>
                                    <ListItem>
                                    <TextField
                                        required
                                        margin="dense"
                                        fullWidth
                                        type="number"
                                        onChange={(e)=>{
                                            setNewUser({...newUser,app_metadata:{...newUser.app_metadata, allowedSlots: +e.target.value}})
                                        }}
                                        id="select-allowedSlots"
                                        label="Tillåtna Bokningar"
                                        helperText="Antal bokningar en användare kan göra per vecka"
                                        />
                                    </ListItem>
                                    <ListItem>
                                    <TextField
                                        required
                                        margin="dense"
                                        fullWidth
                                        type="string"
                                        onChange={(e)=>{
                                            setNewUser({...newUser,password:e.target.value})
                                        }}
                                        id="input-user-password"
                                        label="Lösenord"
                                        />
                                    </ListItem>
                                </List>   
                                <DialogActions>
                                    <Grid  container alignItems='center' justifyContent='center'>
                                        <Grid item>
                                            <Button sx={{margin:"12px",marginTop:0}} color='warning' variant="outlined" onClick={()=>{setShowAddDialog(false)}}>Stäng</Button>
                                        </Grid>
                                        <Grid item>
                                            <LoadingButton loading={wait} variant="outlined"  endIcon={<AddIcon/>} sx={{margin:"12px",marginTop:0}}onClick={handleAddUser}>Skapa</LoadingButton>
                                        </Grid>
                                    </Grid>
                                    
                                </DialogActions>
                        </Dialog>

   )
}
export default NewUserDialog