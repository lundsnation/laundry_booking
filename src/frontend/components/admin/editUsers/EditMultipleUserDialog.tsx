import React, {FormEvent, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Divider,
    Grid,
    List,
    ListItem, MenuItem,
    TextField,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {LoadingButton} from '@mui/lab';
// Make sure BackendAPI, User, and SnackInterface are correctly imported
import BackendAPI from '../../../../apiHandlers/BackendAPI';
import User from '../../../classes/User'; // Assuming UserUpdate is correctly defined
import {SnackInterface} from '../../Snack';
import Config, {LaundryBuilding} from "../../../configs/Config";
import useAsyncError from "../../../errorHandling/asyncError";

interface EditUserDialogProps {
    showEditDialog: boolean;
    setShowEditDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setSnack: (value: (((prevState: SnackInterface) => SnackInterface) | SnackInterface)) => void;
    selectedUsers: User[];
    setSelected: React.Dispatch<React.SetStateAction<User[]>>;
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setSearchedUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
                                                           showEditDialog,
                                                           setShowEditDialog,
                                                           setSnack,
                                                           selectedUsers,
                                                           setSelected,
                                                           setUsers,
                                                           setSearchedUsers,
                                                       }) => {
    const [loading, setLoading] = useState(false);
    const [modification, setModification] = useState({ // Adjusted to match the expected update structure
        app_metadata: {
            laundryBuilding: LaundryBuilding.NATIONSHUSET,
            allowedSlots: 1,
        }
    });
    const throwAsyncError = useAsyncError();

    const handleEditUser = async (e: FormEvent) => {
        try {
            e.preventDefault();
            setLoading(true);

            const updatePromises = selectedUsers.map(user =>
                BackendAPI.patchUser(user.sub, {...modification, name: user.name})
            );

            // Wait for all patch operations to complete
            const updatedUsers = await Promise.all(updatePromises);

            // Update users and searched users state
            setUsers(currentUsers =>
                currentUsers.map(user => updatedUsers.find(u => u.sub === user.sub) || user)
            );

            setSearchedUsers(currentSearchedUsers =>
                currentSearchedUsers.map(user => updatedUsers.find(u => u.sub === user.sub) || user)
            );

            // Display success snack
            setSnack({
                show: true,
                snackString: `Updated ${selectedUsers.length} users`,
                severity: 'success',
                alignment: {vertical: 'bottom', horizontal: 'left'},
            });

            // Reset state and close dialog
            setSelected([]);
            setShowEditDialog(false);
            setModification({
                app_metadata: {
                    laundryBuilding: LaundryBuilding.NATIONSHUSET,
                    allowedSlots: 1,
                }
            });
        } catch (e) {
            // This will be caught by the ErrorBoundary. Can be tweaked to use more specific error messages.
            throwAsyncError(new Error('Något gick fel när du skulle uppdatera användaren.'));
        } finally {
            // Reset loading state and any other cleanup actions here
            setLoading(false);
        }
    };

    return (
        <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)}>
            <DialogTitle>{`Edit User${selectedUsers.length > 1 ? 's' : `: ${selectedUsers[0]?.name}`}`}</DialogTitle>
            <Divider/>
            <form onSubmit={handleEditUser}>
                <List>
                    <ListItem>
                        <TextField
                            margin="dense"
                            fullWidth
                            label="Tvättsuga"
                            select
                            helperText={'Välj tvättstuga'}
                            value={modification.app_metadata.laundryBuilding}
                            onChange={(e) => setModification(prev => (
                                {
                                    ...prev,
                                    app_metadata: {
                                        ...prev.app_metadata,
                                        laundryBuilding: e.target.value as LaundryBuilding
                                    }
                                }
                            ))
                            }
                        >
                            {Config.getLaundryBuildings.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </ListItem>
                    <ListItem>

                        <TextField
                            id="allowed-slots"
                            required={true}
                            label="Tillåtna bokningar"
                            name="allowedSlots"
                            margin="dense"
                            fullWidth
                            value={modification.app_metadata.allowedSlots}
                            onChange={(e) => setModification(prev => {
                                // Check if the input field is empty
                                const value = e.target.value;
                                const allowedSlots = value === '' ? 1 : parseInt(value);

                                // Update the state only if the result is a number
                                // If not a number (NaN), keep the previous value
                                return {
                                    ...prev,
                                    app_metadata: {
                                        ...prev.app_metadata,
                                        allowedSlots: !isNaN(allowedSlots) ? allowedSlots : prev.app_metadata.allowedSlots,
                                    }
                                };
                            })}
                            helperText="Max antal bokningar"
                            inputMode="numeric"
                            type="number"
                        />


                    </ListItem>
                </List>
                <DialogActions>
                    <Grid container justifyContent="space-between" padding={2}>
                        <Button onClick={() => setShowEditDialog(false)} color="warning"
                                variant="outlined">Stäng</Button>
                        <LoadingButton
                            type="submit"
                            loading={loading}
                            variant="outlined"
                            startIcon={<EditOutlinedIcon/>}
                        >
                            Spara
                        </LoadingButton>
                    </Grid>
                </DialogActions>
            </form>
        </Dialog>

    );
};

export default EditUserDialog;
