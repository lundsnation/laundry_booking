import {Grid,Paper,Typography,List,TextField,ListItem} from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { UserType } from "../../../utils/types"
import { useState,FormEvent, useEffect } from "react"
import { SnackInterface } from "../Snack"

interface props{
    user : UserType,
    setSnack : (obj:SnackInterface)=>void
}

const EditProfile = (props:props)=>{
    const {setSnack, user} = props
    const [wait,setWait] = useState(false)
    const [userEditable,setUserEditable] = useState(true)
    const [editedProfile,setEditedProfile] = useState({
        name: user?.name,
        email: user?.email,
        user_metadata: {telephone: user?.user_metadata?.telephone}
    })

    useEffect(()=>{
        if(user.email != editedProfile.email || user.user_metadata?.telephone != editedProfile.user_metadata.telephone){
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
                }else{
                    setSnack({show: true, snackString: await response.json(), severity:'error'})
                }
            setWait(false);
        }

    return(<Paper elevation={0} variant={"outlined"}>
                        <Typography padding={2} variant="h4" >
                            Hej {user?.name}!
                        </Typography>
                        <form onSubmit={(e)=>{handleEditUser(e)}}>
                        <List>
                            <ListItem>
                            <TextField
                                fullWidth
                                label="Ändra E-Post"
                                onChange={(e)=>{
                                    setEditedProfile({...editedProfile,email:e.target.value})
                                }}
                                type="email"
                                variant="outlined"
                                defaultValue={editedProfile.email}
                                margin="dense"
                            />
                            </ListItem>
                            <ListItem>
                            <TextField
                                fullWidth
                                label="Ändra Telefon"
                                onChange={(e)=>{
                                    setEditedProfile({...editedProfile,user_metadata:{telephone : e.target.value}})
                                }}
                                type="telephone"
                                defaultValue={editedProfile.user_metadata?.telephone}
                                variant="outlined"
                                margin="dense"
                            />
                            </ListItem>
                        </List>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <LoadingButton disabled={!userEditable} loading={wait} variant="outlined" sx={{margin: "16px"}} type="submit" >
                                    Spara
                                </LoadingButton>
                            </Grid>
                        </Grid>
                        </form>
                        </Paper>
)}
export default EditProfile;