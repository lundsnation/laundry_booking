import { Button, Typography, Grid, Dialog, DialogActions, DialogTitle, List, ListItem, Divider, ListItemIcon, DialogContent, SnackbarOrigin } from "@mui/material";
import { useState } from "react";
import { UserType } from "../../../utils/types";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { LoadingButton } from "@mui/lab";
import PersonIcon from '@mui/icons-material/Person';
import { SnackInterface } from "../Snack";
import Users from "../../classes/Users";
import User from "../../classes/User";

interface Props {
    showDeleteUserDialog: boolean,
    setShowDeleteUserDialog: (state: boolean) => void,
    selected: Users,
    setSelected: (input: Users) => void,
    users: Users,
    fetchUsers: () => void,
    snack: SnackInterface,
    setSnack: (snackState: SnackInterface) => void,
}

const DeleteUserDialog = (props: Props) => {
    const { showDeleteUserDialog, setShowDeleteUserDialog, selected, users, fetchUsers, snack, setSnack, setSelected } = props
    const [loading, setLoading] = useState(false)
    const alignment: SnackbarOrigin = { vertical: 'bottom', horizontal: 'left' }

    const handleDeleteUser = async () => {
        setLoading(true)
        const deletedUsers: string[] = []
        const selectedUsers = selected

        const resAll = await Promise.all(selectedUsers.map(async (selectedUser: User) => {
            const res = await selectedUser.DELETE()
            if (res.ok) {
                deletedUsers.push(selectedUser.name)

                return res
            } else {
                console.log("Error Deleting user: " + selectedUser.name)
            }
        }))


        setLoading(false);
        setShowDeleteUserDialog(false)
        if (resAll.every((res) => res.ok)) {
            setSnack({ show: true, snackString: "Tog bort " + deletedUsers.length + " användare", severity: 'success', alignment: alignment })

        } else {
            setSnack({ show: true, snackString: "Fel vid borttagning av användare", severity: 'error', alignment: alignment })
        }
        setSelected(new Users())
        fetchUsers()
    }


    const getUserNames = () => {
        if (!selected) {
            return ""
        }
        if (selected.length() === 1) {
            return <ListItem key={"userName"}>
                <ListItemIcon>
                    <PersonIcon />
                    {selected.get(0).name}
                </ListItemIcon>
            </ListItem>
        }
        return selected.map((user, index) => {
            return <ListItem key={index}>
                <ListItemIcon>
                    <PersonIcon />
                    {user.name}
                </ListItemIcon>
            </ListItem>
        })
    }
    return (
        <Dialog
            open={showDeleteUserDialog}
            onClose={() => { setShowDeleteUserDialog(false) }}
        >
            <DialogTitle> Radera</DialogTitle>
            <Divider variant="middle" />
            <DialogContent>
                <Typography> Är du säker att du vill radera följande användare? </Typography>
                <List dense >{getUserNames()}</List>
            </DialogContent>
            <DialogActions>
                <Grid container alignItems='center' justifyContent='center'>
                    <Grid item>
                        <Button sx={{ margin: "12px", marginTop: 0 }} color='warning' variant="outlined" onClick={() => { setShowDeleteUserDialog(false) }}>Nej</Button>
                    </Grid>
                    <Grid item>
                        <LoadingButton type="submit" loading={loading} variant="outlined" color='error' endIcon={<DeleteOutlinedIcon />} sx={{ margin: "12px", marginTop: 0 }} onClick={handleDeleteUser}>Ja</LoadingButton>
                    </Grid>
                </Grid>

            </DialogActions>
        </Dialog>
    )
}
export default DeleteUserDialog