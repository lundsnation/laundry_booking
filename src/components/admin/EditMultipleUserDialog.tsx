import { Button, Typography, Grid, Dialog, DialogActions, DialogTitle, List, ListItem, Divider, TextField, MenuItem, SnackbarOrigin } from "@mui/material";
import { FormEvent, useState } from "react";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { SnackInterface } from "../Snack";
import { LoadingButton } from "@mui/lab";
import User, { ModificationObject } from "../../classes/User";
import BackendAPI from "../../apiHandlers/BackendAPI";
import { LaundryBuilding, Nationshuset, Arkivet } from "../../configs/Config";


interface Props {
    showEditDialog: boolean,
    setShowEditDialog: (state: boolean) => void,
    snack: SnackInterface,
    setSnack: (snackState: SnackInterface) => void,
    selected: User[],
    setSelected: (input: User[]) => void,
    users: User[],
    setUsers: (input: User[]) => void
}



const EditUserDialog = (props: Props) => {
    const { showEditDialog, setShowEditDialog, snack, setSnack, selected, setSelected, users, setUsers } = props
    const [modification, setModification] = useState<ModificationObject>({} as ModificationObject)
    // const [newUserApt, setNewUserApt] = useState("")
    // const [newUserBuldingName, setNewUserBuildingName] = useState("") ---- Tror inte detta behövs men måste testa
    const [wait, setWait] = useState(false);
    const alignment: SnackbarOrigin = { vertical: 'bottom', horizontal: 'left' }

    /* Method to extract the appartment building from the name example "NH1234" -> "NH"
    // or "A1234" -> "A"
    */
    const extractBuilding = (name: string): string => {
        const regex = /^[A-Za-z]+/;
        const found = name.match(regex);
        if (!found) {
            return "";
        }
        return found.join("");
    }

    /* Method to extract the appartment number from the name example "NH1234" -> "1234"
    // or "A1234" -> "1234"
    */
    const extractApt = (name: string): string => {
        const regex = /\d+/;
        const found = name.match(regex);
        if (!found) {
            return "";
        }
        return found.join("");
    }

    const handleEditUser = async (e: FormEvent) => {
        e.preventDefault()
        setWait(true);

        try {
            const ids = selected.map(user => user.sub)
            const updated = await BackendAPI.patchUsers(ids, modification)

            const usersWithoutUpdated = users.filter(user => !ids.includes(user.sub))
            const newUsers = usersWithoutUpdated.concat(updated)

            setUsers(newUsers)
            setSnack({ show: true, snackString: "Uppdaterade " + selected.length + " användare", severity: 'success', alignment: alignment })

        } catch (error) {
            console.log(error)
            setSnack({ show: true, snackString: "Fel vid uppdatering av användare", severity: 'error', alignment: alignment })
        }

        setWait(false);
        setSelected([])
        setModification({} as ModificationObject)
        setShowEditDialog(false)
    }

    const dialogTitle = () => {
        if (selected.length > 1) {
            return <Typography>Ändra: {selected.length} användare</Typography>
        } else if (selected.length === 1) {
            return <Typography>Ändra: {selected[0].name}</Typography>
        } else {
            return <Typography> </Typography>
        }
    }

    const setLaundryBuilding = (building: string): LaundryBuilding => {
        if (building === "NH" || building === "GH") {
            return LaundryBuilding.NATIONSHUSET
        }
        else return LaundryBuilding.ARKIVET
    }

    return (
        <Dialog open={showEditDialog} onClose={() => { setShowEditDialog(false), setModification({} as ModificationObject) }}>
            <DialogTitle>{dialogTitle()}</DialogTitle>
            <Divider variant="middle" />
            <form onSubmit={(e) => { handleEditUser(e) }}>
                <List>
                    <ListItem>
                        <TextField
                            disabled={selected.length > 1}
                            margin="dense"
                            fullWidth
                            defaultValue={selected.length === 1 ? selected[0].user_metadata.telephone : null}
                            onChange={(e) => {
                                setModification({ ...modification, user_metadata: { ...modification.user_metadata, telephone: e.target.value } })
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
                            defaultValue={selected.length === 1 ? selected[0].app_metadata.allowedSlots : null}
                            type="number"
                            onChange={(e) => {
                                setModification({ ...modification, app_metadata: { ...modification.app_metadata, allowedSlots: +e.target.value } })
                            }}
                            id="select-allowedSlots"
                            label="Tillåtna Bokningar"
                            helperText="Antal bokningar en användare kan göra per vecka"
                        />
                    </ListItem>
                </List>
                <DialogActions>
                    <Grid container alignItems='center' justifyContent='center'>
                        <Grid item>
                            <Button sx={{ margin: "12px", marginTop: 0 }} color='warning' variant="outlined" onClick={() => { setShowEditDialog(false), setModification({} as ModificationObject) }}>Stäng</Button>
                        </Grid>
                        <Grid item>
                            <LoadingButton type="submit" loading={wait} variant="outlined" endIcon={<EditOutlinedIcon />} sx={{ margin: "12px", marginTop: 0 }}>Ändra</LoadingButton>
                        </Grid>
                    </Grid>

                </DialogActions>
            </form>
        </Dialog>

    )
}
export default EditUserDialog