import {  Button, Typography,  Grid, Dialog, DialogActions, DialogTitle,List,ListItem,Divider, ListItemIcon, DialogContent} from "@mui/material";
import { useState } from "react";
import { UserType } from "../../../utils/types";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { LoadingButton } from "@mui/lab";
import PersonIcon from '@mui/icons-material/Person';
import { SnackInterface } from "../Snack";

interface Props{
    showDeleteUserDialog : boolean,
    setShowDeleteUserDialog : (state:boolean) => void,
    selected : readonly string[],
    setSelected : (input: string[]) => void,
    users : Array<UserType>,
    fetchUsers : () => void,
    snack: SnackInterface,
    setSnack : (snackState: SnackInterface) => void,
}

const DeleteUserDialog = (props: Props) =>{
    const {showDeleteUserDialog,setShowDeleteUserDialog,selected,users,fetchUsers,snack,setSnack,setSelected} = props 
    const [loading, setLoading] = useState(false)
    
    const handleDeleteUser = async () =>{
        setLoading(true)
        const deletedUsers = []
        const selectedUsers = getSelectedUsers()
        let nbrOkDeletions = 0
        for(let i =0;i<selectedUsers.length;i++){
            try{
                const response = await fetch("/api/user/"+selectedUsers[i].user_id, {method: "Delete"})
                if(response.ok){
                    nbrOkDeletions ++
                    deletedUsers.push(selectedUsers[i].name + " ")
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchUsers()
        setLoading(false);
        setShowDeleteUserDialog(false)
        if(nbrOkDeletions==selectedUsers.length){
            setSnack({show: true, snackString: "Tog bort "+ nbrOkDeletions+" användare: " + deletedUsers as string, severity:'success'})
        }else if(nbrOkDeletions>0){
            setSnack({show: true, snackString: "Tog bort "+ nbrOkDeletions+" användare: " + deletedUsers as string, severity:'info'})
        }else{
            setSnack({show: true, snackString: "Borttagning misslyckad", severity:'error'})
        }
            setSelected([])
        }
        

    const getSelectedUsers = () : Array<UserType> =>{
        if(selected.length === 1 ){
            for(let i=0;i<users.length;i++){
                    if (users[i].name == selected[0]){
                        return [users[i]]
                    }
            }
            return [{} as UserType]
        }
        const selectedUsers : Array<UserType> = []
        selected.forEach(userName => {
            users.forEach( userObject =>{
                if(userObject.name == userName){
                    selectedUsers.push(userObject)
                }}
            )} 
        )
        return selectedUsers 
    }

    const getUserNames = () =>{
        if(!selected){
            return ""
        }
        if(selected.length === 1){
            return <ListItem key={"userName"}>
                        <ListItemIcon>
                            <PersonIcon/>
                                {selected[0]}
                        </ListItemIcon>
                    </ListItem>
        }
        let nameArray : string[] = []
        selected.forEach(e=>{
            nameArray.push(e)
        })
        return nameArray.map((e,index) =>{
            return <ListItem key={index}>
                    <ListItemIcon>
                        <PersonIcon/>
                        {e}
                    </ListItemIcon>
                </ListItem>
        })
        
    }

    return(
        <Dialog 
            open={showDeleteUserDialog} 
            onClose = {()=>{setShowDeleteUserDialog(false)}}
        >
            <DialogTitle> Radera</DialogTitle>
            <Divider variant="middle"/>
            <DialogContent>
                <Typography> Är du säker att du vill radera följande användare? </Typography>
                <List dense >{getUserNames()}</List>
            </DialogContent>
            <DialogActions>
                <Grid  container alignItems='center' justifyContent='center'>
                    <Grid item>
                        <Button sx={{margin:"12px",marginTop:0}} color='warning' variant="outlined" onClick={()=>{setShowDeleteUserDialog(false)}}>Nej</Button>
                    </Grid>
                    <Grid item>
                        <LoadingButton type="submit" loading={loading} variant="outlined" color='error' endIcon={<DeleteOutlinedIcon/>} sx={{margin:"12px",marginTop:0}}onClick={handleDeleteUser}>Ja</LoadingButton>
                    </Grid>
                </Grid>
                
            </DialogActions>
        </Dialog>
    )
}
export default DeleteUserDialog