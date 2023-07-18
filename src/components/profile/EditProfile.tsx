import { Grid, Paper, Typography, List, TextField, ListItem, Button, Box, Stack, ButtonGroup, FormControl, FormGroup, Divider } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { UserEdit, UserType } from "../../../utils/types"
import { useUser } from "@auth0/nextjs-auth0/client"
import { useState, FormEvent, useEffect } from "react"
import { SnackInterface } from "../Snack"
import ChangePasswordDialog from "./ChangePasswordDialog"
import React from "react"
import { isValidPhoneNumber } from 'libphonenumber-js'
import User from "../../classes/User"
import { set } from "mongoose"


interface props {
    user: User,
    setSnack: (obj: SnackInterface) => void
}

const EditProfile = (props: props) => {
    const textFieldVariant = "outlined"
    const { user, setSnack } = props
    const [wait, setWait] = useState(false)
    const [showPasswordChangeDialog, setShowPasswordChangeDialog] = useState(false)
    const [allowSave, setAllowSave] = useState(false)
    const [editedProfile, setEditedProfile] = useState(user.toProfile())


    const handleEditProfile = (formProfile: UserEdit) => {
        if (formProfile.telephone === "") {
            formProfile.telephone = undefined
        }
        setEditedProfile(formProfile)
        if (user.email !== formProfile.email || user.telephone !== formProfile.telephone) {
            setAllowSave(true)
        } else {
            setAllowSave(false)
        }
    }

    const handleSaveEdit = async (e: FormEvent) => {
        e.preventDefault()
        setWait(true);
        //Phone number validation
        const inputPhoneNumber = editedProfile.telephone || ""
        //const countryCode = inputPhoneNumber.substring(0, 3)
        if (!isValidPhoneNumber(inputPhoneNumber)) {
            setSnack({ show: true, snackString: "Ogiltigt format", severity: 'error' })
            setWait(false)
            return
        }

        const res = await user.editProfile(editedProfile)


        if (res) {
            setSnack({ show: true, snackString: "Användare sparad", severity: 'success' })

        } else {
            setSnack({ show: true, snackString: "Fel vid ändring", severity: 'error' })

        }
        setWait(false);
    }

    return (
        <React.Fragment>
            <ChangePasswordDialog
                user={user}
                setSnack={setSnack}
                showPasswordChangeDialog={showPasswordChangeDialog}
                setshowPasswordChangeDialog={setShowPasswordChangeDialog} />
            <Paper sx={{ px: 3 }}>

                <form onSubmit={(e) => { handleSaveEdit(e) }}>
                    <Stack spacing={2}>

                        <Typography display={'flex'} justifyContent='center' padding={2} variant="h4" >
                            Hej {user?.name}!
                        </Typography>

                        <Typography fontWeight={'medium'} paddingLeft={1}>Ändra användauppgifter</Typography>

                        <TextField
                            fullWidth
                            label="Ändra E-Post"
                            onChange={(e) => {
                                handleEditProfile({ ...editedProfile, email: e.target.value })
                            }}
                            type="email"
                            variant={textFieldVariant}
                            defaultValue={user.email}
                            margin="dense"
                        />


                        <TextField
                            fullWidth
                            label="Ändra telefonnummer"
                            onChange={(e) => {
                                handleEditProfile({ ...editedProfile, telephone: e.target.value })
                            }}
                            type="telephone"
                            helperText='Ange telefonnummer med landskod (+46...)'
                            defaultValue={user.telephone}
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
                            <LoadingButton disabled={!allowSave} loading={wait} variant="outlined" type="submit" >
                                Spara
                            </LoadingButton>

                        </Stack>
                    </Stack>
                </form >

            </Paper>
        </React.Fragment >

    )
}
export default EditProfile;