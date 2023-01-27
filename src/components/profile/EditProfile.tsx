import { Grid, Paper, Typography, List, TextField, ListItem, Button, Box, Stack, ButtonGroup, FormControl, FormGroup, Divider } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { UserType } from "../../../utils/types"
import { useUser } from "@auth0/nextjs-auth0/client"
import { useState, FormEvent, useEffect } from "react"
import { SnackInterface } from "../Snack"
import ChangePasswordDialog from "./ChangePasswordDialog"
import React from "react"
import { width } from "@mui/system"
import { WidthFull } from "@mui/icons-material"

interface props {
    user: UserType,
    setSnack: (obj: SnackInterface) => void
}

const EditProfile = (props: props) => {
    const textFieldVariant = "outlined"
    const { user, setSnack } = props
    const [wait, setWait] = useState(false)
    const [showPasswordChangeDialog, setShowPasswordChangeDialog] = useState(false)
    const [userEditable, setUserEditable] = useState(true)
    const [editedProfile, setEditedProfile] = useState({
        name: user?.name,
        email: user?.email,
        user_metadata: { telephone: user?.user_metadata?.telephone }
    })

    useEffect(() => {
        console.log("trig")
        if (user?.email != editedProfile.email || user?.user_metadata?.telephone != editedProfile.user_metadata.telephone) {
            setUserEditable(true)
        } else {
            setUserEditable(false)
        }
    }, [editedProfile, user])

    const handleEditUser = async (e: FormEvent) => {
        e.preventDefault()
        setWait(true);
        let response: Response
        response = await fetch("/api/auth/edit", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editedProfile)
        })
        if (response.ok) {
            setSnack({ show: true, snackString: "Användare sparad", severity: 'success' })
            user.user_metadata = editedProfile.user_metadata
            user.email = editedProfile.email
            user.user_id = user.user_id
        } else {
            setSnack({ show: true, snackString: await response.json(), severity: 'error' })
        }
        setWait(false);
    }

    const handleEditPasswordChange = async (password: string) => {
        return null
    }

    return (
        <React.Fragment>
            <ChangePasswordDialog
                user={user}
                setSnack={setSnack}
                showPasswordChangeDialog={showPasswordChangeDialog}
                setshowPasswordChangeDialog={setShowPasswordChangeDialog} />
            <Paper sx={{ px: 3 }}>
                <Stack>

                    <form onSubmit={(e) => { handleEditUser(e) }}>

                        <Typography display={'flex'} justifyContent='center' padding={3} variant="h4" >
                            hej {user?.name}!
                        </Typography>

                        <Typography fontWeight={'medium'} paddingLeft={2}>Ändra användaruppgfiter</Typography>

                        <TextField
                            fullWidth
                            label="Ändra E-Post"
                            onChange={(e) => {
                                setEditedProfile({ ...editedProfile, email: e.target.value })
                            }}
                            type="email"
                            variant={textFieldVariant}
                            defaultValue={editedProfile.email}
                            margin="dense"
                        />


                        <TextField
                            fullWidth
                            label="Ändra Telefon"
                            onChange={(e) => {
                                setEditedProfile({ ...editedProfile, user_metadata: { telephone: e.target.value } })
                            }}
                            type="telephone"
                            defaultValue={editedProfile.user_metadata?.telephone}
                            variant={textFieldVariant}
                            margin="dense"
                        />
                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            spacing={2}
                            py={2}
                        >
                            <Button color={'warning'} variant="outlined" onClick={() => { setShowPasswordChangeDialog(true) }}>
                                Ändra Lösenord
                            </Button>
                            <LoadingButton disabled={!userEditable} loading={wait} variant="outlined" type="submit" >
                                Spara
                            </LoadingButton>

                        </Stack>
                    </form >

                </Stack>


            </Paper>

        </React.Fragment >

    )
}
export default EditProfile;