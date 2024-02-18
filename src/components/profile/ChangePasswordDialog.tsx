import React, {useState} from 'react';
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Divider,
    Typography,
    Grid,
    Button,
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import User from '../../classes/User';
import {SnackInterface} from "../Snack";
import BackendAPI from "../../apiHandlers/BackendAPI"; // Ensure this import is correct

interface Props {
    showPasswordChangeDialog: boolean;
    setShowPasswordChangeDialog: (show: boolean) => void;
    user: User;
    setSnack: (snack: SnackInterface) => void;
}

const ChangePasswordDialog: React.FC<Props> = ({
                                                   showPasswordChangeDialog,
                                                   setShowPasswordChangeDialog,
                                                   user,
                                                   setSnack,
                                               }) => {
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async () => {
        setLoading(true);
        await BackendAPI.ChangePassword(user.email);

        setSnack({show: true, snackString: "Mail om ändring av lösenord skickat!", severity: "success"});
        setShowPasswordChangeDialog(false);
        setLoading(false);
    };

    return (
        <Dialog open={showPasswordChangeDialog} onClose={() => setShowPasswordChangeDialog(false)}>
            <DialogTitle>Ändra lösenord</DialogTitle>
            <Divider variant="middle"/>
            <DialogContent>
                <Typography>
                    Är du säker att du vill ändra lösenord? <br/>
                    Ett mail med instruktioner kommer att skickas till: <br/>
                </Typography>
                <Typography align="center" variant="body1" sx={{fontWeight: "bold", mt: 2}}>
                    {user.email}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Grid container alignItems='center' justifyContent='center'>
                    <Grid item>
                        <Button color='warning' variant="outlined" onClick={() => setShowPasswordChangeDialog(false)}>
                            Nej
                        </Button>
                    </Grid>
                    <Grid item>
                        <LoadingButton loading={loading} variant="outlined" color='primary'
                                       onClick={handlePasswordChange}>
                            Ja
                        </LoadingButton>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default ChangePasswordDialog;
