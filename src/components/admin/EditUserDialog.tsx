import { Button, Container, Typography, Paper, Grid, Dialog, DialogActions, DialogTitle, List, ListItem, Divider, TextField, MenuItem, AlertColor, SnackbarOrigin } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { UserType, assertBuilding } from "../../../utils/types";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { SnackInterface } from "../Snack";
import { LoadingButton } from "@mui/lab";

interface Props {
    showEditDialog: boolean,
    setShowEditDialog: (state: boolean) => void,
    snack: SnackInterface,
    setSnack: (snackState: SnackInterface) => void,
    fetchUsers: () => void,
    selected: readonly string[],
    setSelected: (input: string[]) => void,
    users: Array<UserType>,
}

const EditUserDialog = (props: Props) => {
    const { showEditDialog, setShowEditDialog, snack, setSnack, fetchUsers, selected, setSelected, users } = props
    const [newUser, setNewUser] = useState<UserType>({} as UserType)
    const [newUserApt, setNewUserApt] = useState("")
    const [newUserBuldingName, setNewUserBuildingName] = useState("")
    const [wait, setWait] = useState(false);
    const alignment: SnackbarOrigin = { vertical: 'bottom', horizontal: 'left' }

    useEffect(() => {
        setNewUser({
            ...newUser,
            name: newUserBuldingName + newUserApt as string,
            app_metadata: { ...newUser.app_metadata, building: assertBuilding(newUserBuldingName) }
        })

    }, [newUserApt, newUserBuldingName])

    const handleEditUser = async (e: FormEvent) => {
        e.preventDefault()
        setWait(true);
        const selectedUsers = getSelectedUsers()
        const editedUsers = []
        if (selectedUsers.length > 0) {
            let tempUser: UserType
            let userID: string | undefined
            let response: Response
            //TODO: Implement new class User PATCH() method to patch
            for (let i = 0; i < selectedUsers.length; i++) {
                tempUser = { ...newUser, app_metadata: { ...selectedUsers[i].app_metadata, ...newUser.app_metadata } }
                if (tempUser.name == "") {
                    tempUser.name = selectedUsers[i].name
                }
                // If e-mail has changed, set acceptedTerms = false
                if (tempUser.email != selectedUsers[i].email) {
                    tempUser = { ...tempUser, app_metadata: { ...tempUser.app_metadata, acceptedTerms: false } }
                }
                userID = selectedUsers[i].user_id
                response = await fetch("/api/user/" + userID, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(tempUser)
                })
                if (response.ok) {
                    editedUsers.push(selectedUsers[i].name)
                }
            }
        }
        fetchUsers()
        setWait(false);
        if (editedUsers.length == selectedUsers.length) {
            setSnack({ show: true, snackString: "Ändrade " + editedUsers.length + " användare: " + editedUsers as string, severity: 'success', alignment: alignment })
        } else if (editedUsers.length > 0) {
            setSnack({ show: true, snackString: "Ändrade " + editedUsers.length + " användare: " + editedUsers as string, severity: 'info', alignment: alignment })
        } else {
            setSnack({ show: true, snackString: "Ändring misslyckad", severity: 'error', alignment: alignment })
        }
        setSelected([])
        setNewUser({} as UserType)
        setNewUserBuildingName("")
        setNewUserApt("")
        setShowEditDialog(false)
    }

    const getSelectedUsers = (): Array<UserType> => {
        if (selected.length === 1) {
            for (let i = 0; i < users.length; i++) {
                if (selected[0] == users[i].name) {
                    return [users[i]]
                }
            }
        }
        const selectedUsers: Array<UserType> = []
        selected.forEach(userName => {
            users.forEach(userObject => {
                if (userObject.name == userName) {
                    selectedUsers.push(userObject)
                }
            }
            )
        }
        )
        return selectedUsers
    }


    return (
        <Dialog open={showEditDialog} onClose={() => { setShowEditDialog(false) }}>
            <DialogTitle> Ändra : {selected.length > 1 ? "Flera användare" : selected[0]}</DialogTitle>
            <Divider variant="middle" />
            <form onSubmit={(e) => { handleEditUser(e) }}>
                <List >
                    <ListItem >
                        <TextField
                            id="select-building"
                            margin="dense"
                            select
                            disabled={selected.length > 1}
                            fullWidth
                            value={newUserBuldingName}
                            onChange={(e) => {
                                setNewUserBuildingName(e.target.value)
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
                            onChange={(e) => {
                                setNewUserApt(e.target.value as string)
                            }}
                            margin="dense"
                            fullWidth
                            disabled={selected.length > 1}
                            id="input-apt-number"
                            label="Lägenhetsnummer"
                            helperText="4 siffror"
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            disabled={selected.length > 1}
                            margin="dense"
                            fullWidth
                            defaultValue={selected.length === 1 ? getSelectedUsers()[0].user_metadata?.telephone : null}
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
                            margin="dense"
                            fullWidth
                            defaultValue={selected.length === 1 ? getSelectedUsers()[0].email : null}
                            disabled={selected.length > 1}
                            onChange={(e) => {
                                setNewUser({ ...newUser, email: e.target.value })
                            }}
                            id="input-email"
                            label="E-post"
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            margin="dense"
                            fullWidth
                            defaultValue={selected.length === 1 ? getSelectedUsers()[0].app_metadata?.allowedSlots : null}
                            type="number"
                            onChange={(e) => {
                                setNewUser({ ...newUser, app_metadata: { ...newUser.app_metadata, allowedSlots: +e.target.value } })
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
                            <Button sx={{ margin: "12px", marginTop: 0 }} color='warning' variant="outlined" onClick={() => { setShowEditDialog(false) }}>Stäng</Button>
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