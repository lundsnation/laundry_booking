import { Button, Grid, Dialog, DialogActions, DialogTitle, List, ListItem, Divider, TextField, MenuItem, SnackbarOrigin } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ERROR_MSG, UserType, assertBuilding } from "../../../utils/types";
import AddIcon from '@mui/icons-material/Add';
import { SnackInterface } from "../Snack";
import { LoadingButton } from "@mui/lab";
import User from "../../classes/User";

interface Props {
    showAddDialog: boolean,
    setShowAddDialog: (state: boolean) => void,
    snack: SnackInterface,
    setSnack: (snackState: SnackInterface) => void,
    fetchUsers: () => void,
}

const NewUserDialog = (props: Props) => {
    const { showAddDialog, setShowAddDialog, snack, setSnack, fetchUsers } = props
    const [newUser, setNewUser] = useState<UserType>({} as UserType) //Skapa en ny typ bara innehåller värdena som sättas i formuläret?
    const [newUserApt, setNewUserApt] = useState("") // Är dessa states verkligen nödvändiga?
    const [newUserBulding, setNewUserBuilding] = useState("") // Är detta nödvändigt
    const [wait, setWait] = useState(false);
    const alignment: SnackbarOrigin = { vertical: 'bottom', horizontal: 'left' }


    const handleAddUser = async (event: FormEvent) => {
        event.preventDefault();
        setWait(true)
        const user = User.fromJSON(newUser)
        const response = await user.POST()
        setWait(false);

        if (response.ok) {
            setSnack({ show: true, snackString: "Skapade " + user.name, severity: 'success', alignment: alignment })
            setNewUser({} as UserType)
            setNewUserBuilding("")
            setNewUserApt("")
            setShowAddDialog(false)
            fetchUsers()
            return
        }
        setSnack({ show: true, snackString: ERROR_MSG.AUTH0RESPONSEERROR, severity: "error", alignment: alignment })
    }

    // Updates newUser object whenever newUserApt or newUserBuilding changes
    useEffect(() => {
        setNewUser({
            ...newUser,
            name: newUserBulding + newUserApt as string,
            app_metadata: { ...newUser.app_metadata, building: assertBuilding(newUserBulding) }
        })
    }, [newUserApt, newUserBulding])

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
                            value={newUserBulding}
                            onChange={(e) => {
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