import {Grid,Paper,Typography,List,TextField,ListItem, Button} from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { UserType } from "../../../utils/types"
import { useUser } from "@auth0/nextjs-auth0/client"
import { useState,FormEvent, useEffect } from "react"
import { SnackInterface } from "../Snack"
import ChangePasswordDialog from "./ChangePasswordDialog"

interface props{
    user : UserType,
    setSnack : (obj:SnackInterface)=>void
}

const EditProfile = (props:props)=>{

    const textFieldVariant = "outlined"
    const {user,setSnack} = props
    const [wait,setWait] = useState(false)
    const [showPasswordChangeDialog,setShowPasswordChangeDialog] = useState(false)
    const [userEditable,setUserEditable] = useState(true)
    const [editedProfile,setEditedProfile] = useState({
        name: user?.name,
        email: user?.email,
        user_metadata: {telephone: user?.user_metadata?.telephone}
    })

    useEffect(()=>{
        if(user?.email != editedProfile.email || user?.user_metadata?.telephone != editedProfile.user_metadata.telephone){
            setUserEditable(true)
        }else{
            setUserEditable(false)
        }
    },[editedProfile])

    const handleEditUser = async (e : FormEvent) =>{
        e.preventDefault()
        setWait(true);
            let response : Response
                console.log(editedProfile)
                response = await fetch("/api/auth/edit", {
                    method: "PATCH",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(editedProfile)
                })
                console.log(response)
                console.log(await response.json())
                if(response.ok){
                    setSnack({show: true, snackString: "Användare sparad", severity:'success'})
                    user.email = editedProfile.email
                    user.user_metadata = editedProfile.user_metadata
                }else{
                    setSnack({show: true, snackString: await response.json(), severity:'error'})
                }
            setWait(false);
        }

        const handleEditPasswordChange = async (password:string)=>{
            return null
        }

    return(
    <Paper elevation={0} variant={"outlined"}>
        <ChangePasswordDialog 
            user={user}
            setSnack={setSnack} 
            showPasswordChangeDialog={showPasswordChangeDialog} 
            setshowPasswordChangeDialog={setShowPasswordChangeDialog}/>
                        <Typography padding={2} variant="h4" >
                            Hej {user?.name}!
                        </Typography>
                        
                        <List>
                            <Typography paddingLeft={2} variant="button" >Ändra lösenord</Typography>
                                <ListItem>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Button variant="outlined" fullWidth onClick={()=>{setShowPasswordChangeDialog(true)}}>
                                            <Typography variant="body2">
                                                Ändra Lösenord
                                            </Typography>
                                        </Button>
                                    </Grid>
                                    
                                </Grid>
                                
                            </ListItem>
                            <Typography paddingLeft={2} variant="button">Ändra användaruppgfiter</Typography>
                            <form onSubmit={(e)=>{handleEditUser(e)}}>
                            <ListItem key={"Email"}>
                                <TextField
                                    fullWidth
                                    label="Ändra E-Post"
                                    onChange={(e)=>{
                                        setEditedProfile({...editedProfile,email:e.target.value})
                                    }}
                                    type="email"
                                    variant={textFieldVariant}
                                    defaultValue={editedProfile.email}
                                    margin="dense"
                                />
                            </ListItem>
                            <ListItem key={"Telephone"}>
                                <TextField
                                    fullWidth
                                    label="Ändra Telefon"
                                    onChange={(e)=>{
                                        setEditedProfile({...editedProfile,user_metadata:{telephone : e.target.value}})
                                    }}
                                    type="telephone"
                                    defaultValue={editedProfile.user_metadata?.telephone}
                                    variant={textFieldVariant}
                                    margin="dense"
                                />
                            </ListItem>
                            <ListItem>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <LoadingButton disabled={!userEditable} loading={wait} variant="outlined" sx={{margin: "16px"}} type="submit" >
                                            Spara
                                        </LoadingButton>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            </form>
                        </List>
                        
                        
                        </Paper>
)}
export default EditProfile;