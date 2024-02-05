import { Button, Container, Typography, Paper, Grid, Dialog, DialogActions, DialogTitle, List, ListItem, Divider, TextField, MenuItem, AlertColor, SnackbarOrigin } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ModificationObject } from "../../apiHandlers/Auth0API";
import { SnackInterface } from "../Snack";
import { LoadingButton } from "@mui/lab";
import Users from "../../classes/Users";
import User from "../../classes/User";

interface Props {
    showEditDialog: boolean,
    setShowEditDialog: (state: boolean) => void,
    snack: SnackInterface,
    setSnack: (snackState: SnackInterface) => void,
    selected: Users,
    setSelected: (input: Users) => void,
    users: Users,
    setUsers: (input: Users) => void
}

const EditUserDialog = (props: Props) => {
    const { showEditDialog, setShowEditDialog, snack, setSnack, selected, setSelected, users, setUsers } = props
    const [modification, setModification] = useState({} as ModificationObject)
    const [newUserApt, setNewUserApt] = useState("")
    const [newUserBuldingName, setNewUserBuildingName] = useState("")
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

    const handleEditUser = async (e: FormEvent) => {
        e.preventDefault()
        setWait(true);

        try {
            const allPatches: Promise<Response>[] = selected.map(async (user: User) => {
                console.log(modification)
                const res = await user.PATCH(modification)
                return res
            })
            const results: Response[] = await Promise.all(allPatches)

            if (results.every(res => res.ok)) {
                selected.forEach((user: User) => {
                    user.update(modification)
                })
                setUsers(users)
                setSnack({ show: true, snackString: "Uppdaterade " + selected.length() + " användare", severity: 'success', alignment: alignment })
            } else {
                setSnack({ show: true, snackString: "Fel vid uppdatering av användare", severity: 'error', alignment: alignment })
            }
        } catch (error) {
            console.log(error)
            setSnack({ show: true, snackString: "Fel vid uppdatering av användare", severity: 'error', alignment: alignment })
        }

        setWait(false);
        setSelected(new Users())
        setModification({} as ModificationObject)
        setShowEditDialog(false)
    }

    const dialogTitle = () => {
        if (selected.length() > 1) {
            return <Typography>Ändra: {selected.length()} användare</Typography>
        } else if (selected.length() === 1) {
            return <Typography>Ändra: {selected.get(0).name}</Typography>
        } else {
            return <Typography> </Typography>
        }
    }

    return (
        <Dialog open={showEditDialog} onClose={() => { setShowEditDialog(false), setModification({}) }}>
            <DialogTitle>{dialogTitle()}</DialogTitle>
            <Divider variant="middle" />
            <form onSubmit={(e) => { handleEditUser(e) }}>
                <List >
                    <ListItem >
                        <TextField
                            required
                            id="select-building"
                            margin="dense"
                            select
                            // defaultValue={selected.length() === 1 ? selected.get(0).building : null}
                            disabled={selected.length() > 1}
                            fullWidth
                            value={extractBuilding(modification.name)}
                            onChange={(e) => {
                                const apt = modification.name ? extractAppartment(modification.name) : extractAppartment(selected.get(0).name)
                                console.log("byggnad")
                                setModification({
                                    ...modification,
                                    name: e.target.value + apt,
                                    app_metadata: {
                                        ...modification.app_metadata, building: assertBuilding(e.target.value)
                                    }
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
                                if (e.target.value.length > 3) {
                                    console.log("nummer")
                                    const building = modification.name ? extractBuilding(modification.name) : extractBuilding(selected.get(0).name)
                                    setModification({ ...modification, name: building + e.target.value })
                                }
                            }}
                            margin="dense"

                            fullWidth
                            disabled={selected.length() > 1}
                            id="input-apt-number"
                            label="Lägenhetsnummer"
                            helperText="4 siffror"
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            disabled={selected.length() > 1}
                            margin="dense"
                            fullWidth
                            defaultValue={selected.length() === 1 ? selected.get(0).telephone : null}
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
                            defaultValue={selected.length() === 1 ? selected.get(0).email : null}
                            disabled={selected.length() > 1}
                            onChange={(e) => {
                                setModification({ ...modification, email: e.target.value })
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
                            defaultValue={selected.length() === 1 ? selected.get(0).allowedSlots : null}
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
                            <Button sx={{ margin: "12px", marginTop: 0 }} color='warning' variant="outlined" onClick={() => { setShowEditDialog(false), setModification({}) }}>Stäng</Button>
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