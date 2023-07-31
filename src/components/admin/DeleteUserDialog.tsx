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
    setUsers: (users: Users) => void
    searchedUsers: Users,
    setSearchedUsers: (users: Users) => void,
    snack: SnackInterface,
    setSnack: (snackState: SnackInterface) => void,
}

const DeleteUserDialog = (props: Props) => {
    const { showDeleteUserDialog, setShowDeleteUserDialog, selected, users, setUsers, searchedUsers, setSearchedUsers, snack, setSnack, setSelected } = props
    const [loading, setLoading] = useState(false)
    const alignment: SnackbarOrigin = { vertical: 'bottom', horizontal: 'left' }

    const handleDeleteUser = async () => {
        setLoading(true)
        const deletedUsers: string[] = []

        const allDeletes: Promise<Response>[] = selected.map(async (user: User) => {
            const res = await user.DELETE()
            return res
        })
        const results: Response[] = await Promise.all(allDeletes)
        if (results.every(res => res.ok)) {
            let newUsers = users.copy()
            let newSearched = searchedUsers.copy()
            selected.forEach((user: User) => {
                deletedUsers.push(user.name)
                newUsers = newUsers.remove(user)
                newSearched = newSearched.remove(user)
            })
            setUsers(newUsers)
            setSearchedUsers(newSearched)
            // setSearchedUsers(searchedUsers)
            setSnack({ show: true, snackString: "Tog bort " + deletedUsers.length + " användare", severity: 'success', alignment: alignment })
        } else {
            setSnack({ show: true, snackString: "Fel vid borttagning av användare", severity: 'error', alignment: alignment })
        }
        setSelected(new Users())
        setLoading(false);
        setShowDeleteUserDialog(false)

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