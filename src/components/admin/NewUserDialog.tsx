import { Button, Grid, Dialog, DialogActions, DialogTitle, List, ListItem, Divider, TextField, MenuItem, SnackbarOrigin } from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { Building, ERROR_MSG, UserType } from "../../../utils/types";
import AddIcon from '@mui/icons-material/Add';
import { SnackInterface } from "../Snack";
import { LoadingButton } from "@mui/lab";
import User from "../../classes/User";
import Users from "../../classes/Users";

interface Props {
    showAddDialog: boolean,
    setShowAddDialog: (state: boolean) => void,
    snack: SnackInterface,
    setSnack: (snackState: SnackInterface) => void,
    setUsers: React.Dispatch<React.SetStateAction<Users>>;
}

const NewUserDialog = (props: Props) => {
    const { showAddDialog, setShowAddDialog, snack, setSnack, setUsers } = props
    const [newUser, setNewUser] = useState<UserType>({ name: "", email: "", app_metadata: { building: "NH" } });
    const [wait, setWait] = useState(false);
    const alignment: SnackbarOrigin = { vertical: 'bottom', horizontal: 'left' }

    const handleAddUser = async (event: FormEvent) => {
        event.preventDefault();
        setWait(true)
        const user = User.fromUserType(newUser)
        const response = await user.POST()
        setWait(false);

        if (response.status === 200 || response.status === 201) {
            const createdUser = User.fromJSON(response.data)
            setSnack({ show: true, snackString: "Skapade " + user.name, severity: 'success', alignment: alignment })
            setNewUser({ name: "", email: "", app_metadata: { building: "NH" } })
            setShowAddDialog(false)
            setUsers((prevUsers: Users) => prevUsers.add(createdUser));
        } else {
            console.log("Error creating user")
            setSnack({ show: true, snackString: ERROR_MSG.AUTH0RESPONSEERROR, severity: "error", alignment: alignment })
        }
    }

    return (
        <Dialog open={showAddDialog} onClose={() => { setShowAddDialog(false) }}>
            <DialogTitle> Lägg till ny användare</DialogTitle>
            <Divider variant="middle" />
            <form onSubmit={(e) => { handleAddUser(e) }}>
                <List >
                    <ListItem >
                        <TextField
                            id="select-building"
                            margin="dense"
                            select
                            fullWidth
                            value={newUser.app_metadata?.building}
                            onChange={(e) => {
                                const apartment = newUser.app_metadata?.apartment ? newUser.app_metadata?.apartment : ""
                                setNewUser({
                                    ...newUser,
                                    name: e.target.value + apartment as string,
                                    app_metadata: { ...newUser.app_metadata, building: e.target.value as Building }
                                })
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
                            <MenuItem key={"Arkivet-A"} value={"A"}>
                                A
                            </MenuItem>
                            <MenuItem key={"Arkivet-B"} value={"B"}>
                                B
                            </MenuItem>
                            <MenuItem key={"Arkivet-C"} value={"C"}>
                                C
                            </MenuItem>
                            <MenuItem key={"Arkivet-D"} value={"D"}>
                                D
                            </MenuItem>
                        </TextField>
                    </ListItem>
                    <ListItem>
                        <TextField
                            required
                            onChange={(e) => {
                                setNewUser({
                                    ...newUser,
                                    name: newUser.app_metadata?.building + e.target.value as string,
                                    app_metadata: { ...newUser.app_metadata, apartment: e.target.value }
                                })
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
                            margin="dense"
                            fullWidth
                            onChange={(e) => {
                                setNewUser({ ...newUser, user_metadata: { ...newUser.user_metadata, telephone: e.target.value } })
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
                            onChange={(e) => {
                                setNewUser({ ...newUser, email: e.target.value })
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
                            onChange={(e) => {
                                setNewUser({ ...newUser, app_metadata: { ...newUser.app_metadata, allowedSlots: +e.target.value } })
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
                            onChange={(e) => {
                                setNewUser({ ...newUser, password: e.target.value })
                            }}
                            id="input-user-password"
                            label="Lösenord"
                        />
                    </ListItem>
                </List>
                <DialogActions>
                    <Grid container alignItems='center' justifyContent='center'>
                        <Grid item>
                            <Button sx={{ margin: "12px", marginTop: 0 }} color='warning' variant="outlined" onClick={() => { setShowAddDialog(false) }}>Stäng</Button>
                        </Grid>
                        <Grid item>
                            <LoadingButton type="submit" loading={wait} variant="outlined" endIcon={<AddIcon />} sx={{ margin: "12px", marginTop: 0 }}>Skapa</LoadingButton>
                        </Grid>
                    </Grid>

                </DialogActions>
            </form>
        </Dialog>

    )
}
export default NewUserDialog