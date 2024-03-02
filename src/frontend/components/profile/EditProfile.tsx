import React, {useState, FormEvent} from 'react';
import {
    Paper, Typography, TextField, Button, Stack
} from '@mui/material';

import {isValidPhoneNumber} from 'libphonenumber-js';
import User, {UserProfileUpdate} from '../../models/User';
import ChangePasswordDialog from './ChangePasswordDialog';
import {SnackInterface} from "../Snack";
import BackendAPI from "../../../apiHandlers/BackendAPI";
import {LoadingButton} from '@mui/lab';
import useAsyncError from "../../errorHandling/asyncError";
import {isAxiosError} from "axios";

interface Props {
    initUser: User;
    setSnack: (obj: SnackInterface) => void;
}

const EditProfile: React.FC<Props> = ({initUser, setSnack}: Props) => {
    const [user, setUser] = useState<User>(initUser);
    const [loading, setLoading] = useState(false);
    const [showPasswordChangeDialog, setShowPasswordChangeDialog] = useState(false);
    const [allowSave, setAllowSave] = useState(false);
    const [profileUpdate, setProfileUpdate] = useState<UserProfileUpdate>({
        email: user.email,
        user_metadata: {telephone: user.user_metadata.telephone}
    });
    const throwAsyncError = useAsyncError();

    const handleEditProfile = (profileUpdate: UserProfileUpdate) => {
        setProfileUpdate(profileUpdate);
        // Check if the user has made any changes to the profile, if yes, allow save.
        setAllowSave(user.email !== profileUpdate.email || user.user_metadata.telephone !== profileUpdate.user_metadata.telephone);
    };

    const handleSaveEdit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const inputPhoneNumber = profileUpdate.user_metadata.telephone || '';
        if (!isValidPhoneNumber(inputPhoneNumber)) {
            setSnack({show: true, snackString: 'Ogiltigt format', severity: 'error'});
            setLoading(false);
            return;
        }

        try {


            const user = await BackendAPI.updateUserProfile((profileUpdate));
            setUser(user);
            setSnack({show: true, snackString: 'Användare sparad', severity: 'success'});
        } catch (e) {
            if (isAxiosError(e)) {
                throwAsyncError(e);
            } else {
                throwAsyncError(new Error("An error occurred while updating user profile"));
            }
        } finally {
            setLoading(false);
            setAllowSave(false);
        }
    };

    return (
        <>
            <ChangePasswordDialog
                user={user}
                setSnack={setSnack}
                showPasswordChangeDialog={showPasswordChangeDialog}
                setShowPasswordChangeDialog={setShowPasswordChangeDialog}
            />
            <Paper sx={{px: 3}}>
                <form onSubmit={handleSaveEdit}>
                    <Stack spacing={2}>
                        <Typography display="flex" justifyContent="center" padding={2} variant="h4">
                            Hej {user?.name}!
                        </Typography>

                        <Typography fontWeight="medium" paddingLeft={1}>Ändra användaruppgifter</Typography>

                        {/* Email */}
                        <TextField
                            fullWidth
                            label="Ändra E-Post"
                            onChange={(e) => handleEditProfile({...profileUpdate, email: e.target.value})}
                            type="email"
                            variant="outlined"
                            defaultValue={profileUpdate.email}
                            margin="dense"
                        />

                        {/* Telephone */}
                        <TextField
                            fullWidth
                            label="Ändra telefonnummer"
                            onChange={(e) => handleEditProfile({
                                ...profileUpdate,
                                user_metadata: {...profileUpdate.user_metadata, telephone: e.target.value}
                            })}
                            type="telephone"
                            helperText="Ange telefonnummer med landskod (+46...)"
                            defaultValue={profileUpdate.user_metadata.telephone}
                            variant="outlined"
                            margin="dense"
                        />

                        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} py={2}>
                            <Button color="warning" variant="outlined"
                                    onClick={() => setShowPasswordChangeDialog(true)}>
                                Ändra Lösenord
                            </Button>
                            <LoadingButton disabled={!allowSave} loading={loading} variant="outlined" type="submit">
                                Spara
                            </LoadingButton>
                        </Stack>
                    </Stack>
                </form>
            </Paper>
        </>
    );
};

export default EditProfile;
