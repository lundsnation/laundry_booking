import React, {FormEvent, useState} from 'react';
import {
    Button, ButtonGroup,
    Dialog,
    DialogActions,
    DialogTitle,
    Divider,
    List,
    ListItem,
    MenuItem,
    TextField
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import User, {UserUpdate} from '../../../models/User';
import {SnackInterface} from '../../Snack';
import Config, {Building, LaundryBuilding} from "../../../configs/Config";
import BackendAPI from "../../../../apiHandlers/BackendAPI";
import useAsyncError from "../../../errorHandling/asyncError";

interface Props {
    showEditDialog: boolean;
    setShowEditDialog: (state: boolean) => void;
    setSnack: (snackState: SnackInterface) => void;
    selectedUser: User;
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setSelected: React.Dispatch<React.SetStateAction<User[]>>;
    setSearchedUsers: React.Dispatch<React.SetStateAction<User[]>>;
}


interface EditUser {
    building: Building,
    room: string,
    email: string,
    user_metadata: {
        telephone: string,
    },
    app_metadata: {
        acceptedTerms: boolean,
        allowedSlots: number,
        laundryBuilding: LaundryBuilding,
    },
}


const EditSingleUserDialog: React.FC<Props> = ({
                                                   showEditDialog,
                                                   setShowEditDialog,
                                                   setSnack,
                                                   selectedUser,
                                                   setUsers,
                                                   setSelected,
                                                   setSearchedUsers,
                                               }) => {
    const [editedUser, setEditeduser] = useState<EditUser>({
        building: selectedUser.building as Building,
        room: selectedUser.roomNumber,
        email: selectedUser.email,
        user_metadata: {
            telephone: selectedUser.user_metadata.telephone,
        },
        app_metadata: {
            acceptedTerms: selectedUser.app_metadata.acceptedTerms,
            allowedSlots: selectedUser.app_metadata.allowedSlots,
            laundryBuilding: selectedUser.app_metadata.laundryBuilding,
        },
    });
    const [loading, setLoading] = useState<boolean>(false);
    const throwAsyncError = useAsyncError();


    const handleSubmit = async (e: FormEvent) => {

        e.preventDefault();
        setLoading(true);

        try {


            const updatedUser: UserUpdate = {
                name: editedUser.building + editedUser.room,
                email: editedUser.email,
                user_metadata: editedUser.user_metadata,
                app_metadata: editedUser.app_metadata,
            };

            const updatedUserData = await BackendAPI.patchUser(selectedUser.sub, updatedUser);
            setUsers(currentUsers =>
                currentUsers.map(user =>
                    user.sub === updatedUserData.sub ? updatedUserData : user
                )
            );

            setSearchedUsers(currentUsers =>
                currentUsers.map(user =>
                    user.sub === updatedUserData.sub ? updatedUserData : user
                )
            );


            setSnack({
                show: true,
                snackString: `User updated: ${selectedUser.name}`,
                severity: 'success',
                alignment: {vertical: 'bottom', horizontal: 'left'},
            });

            setShowEditDialog(false);
            setSelected([])
            setEditeduser({} as EditUser);

        } catch (e) {
            throwAsyncError(new Error("Något gick fel när du skulle uppdatera användaren. Försök igen."))
        } finally {
            setLoading(false);
        }
    };


    const buildingMenuItems = Config.getBuildings.map((code) => (
        <MenuItem key={code} value={code}>
            {code}
        </MenuItem>
    ));

    return (
        <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)}>
            <DialogTitle>Ändra användare</DialogTitle>
            <Divider variant="middle"/>
            <form onSubmit={handleSubmit}>

                <List>
                    {/* Building */}
                    <ListItem>
                        <TextField
                            required
                            id="select-building"
                            margin="dense"
                            select
                            fullWidth
                            value={editedUser.building}
                            onChange={(e) => {
                                setEditeduser({...editedUser, building: e.target.value as Building});
                            }}
                            label="Välj Byggnad"
                            helperText="Välj Byggnad"
                        >
                            {buildingMenuItems}
                        </TextField>
                    </ListItem>
                    {/* Room Number */}
                    <ListItem>
                        <TextField
                            id="room-number"
                            label="Rums-/lägenhetsnummer,"
                            name="roomNbr"
                            margin="dense"
                            fullWidth
                            value={editedUser.room}
                            onChange={(e) => {
                                setEditeduser({...editedUser, room: e.target.value});
                            }}
                            helperText={"Max 4 siffror + eventuell bokstav"}
                            inputMode={"numeric"}
                        />
                    </ListItem>

                    {/* Email */}
                    <ListItem>
                        <TextField
                            id="email"
                            label="Email"
                            name="email"
                            margin="dense"
                            type={"email"}
                            fullWidth
                            value={editedUser.email}
                            onChange={(e) => {
                                setEditeduser({...editedUser, email: e.target.value});
                            }}
                        />
                    </ListItem>

                    {/* Telephone */}
                    <ListItem>
                        <TextField
                            id="telephone"
                            label="Telefonnummer"
                            name="telephone"
                            margin="dense"
                            type={"tel"}
                            fullWidth
                            value={editedUser.user_metadata?.telephone}
                            onChange={(e) => {
                                setEditeduser({
                                    ...editedUser,
                                    user_metadata: {...editedUser.user_metadata, telephone: e.target.value},
                                });
                            }}
                        />
                    </ListItem>

                    {/* Laundry Building */}
                    <ListItem>
                        <TextField
                            id="laundry-building"
                            margin="dense"
                            select
                            fullWidth
                            value={editedUser.app_metadata.laundryBuilding}
                            onChange={(e) => {
                                setEditeduser({
                                    ...editedUser,
                                    app_metadata: {
                                        ...editedUser.app_metadata,
                                        laundryBuilding: e.target.value as LaundryBuilding
                                    },
                                });
                            }}
                            label="Tvättstuga"
                            helperText="Välj tvättstuga"
                        >
                            {Config.getLaundryBuildings.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </ListItem>

                    {/* Accepted Terms */}
                    <ListItem>
                        <TextField
                            id="accepted-terms"
                            margin="dense"
                            select
                            fullWidth
                            value={editedUser.app_metadata?.acceptedTerms}
                            onChange={(e) => {
                                setEditeduser({
                                    ...editedUser,
                                    app_metadata: {
                                        ...editedUser.app_metadata,
                                        acceptedTerms: e.target.value === 'true'
                                    },
                                });
                            }}
                            label="Accepterade villkor"
                            helperText="Villkor"
                        >
                            <MenuItem key={"true"} value={"true"}>
                                Ja
                            </MenuItem>
                            <MenuItem key={"false"} value={"false"}>
                                Nej
                            </MenuItem>
                        </TextField>
                    </ListItem>

                    {/* Allowed Slots */}
                    <ListItem>
                        <TextField
                            id="allowed-slots"
                            label="Antal bokningar"
                            name="allowedSlots"
                            margin="dense"
                            type={"number"}
                            fullWidth
                            value={editedUser.app_metadata?.allowedSlots || 1}
                            onChange={(e) => {
                                setEditeduser({
                                    ...editedUser,
                                    app_metadata: {...editedUser.app_metadata, allowedSlots: parseInt(e.target.value)},
                                });
                            }}
                            helperText={"Antal bokningar"}
                            inputMode={"numeric"}
                        />
                    </ListItem>


                </List>
                <DialogActions>
                    <ButtonGroup
                        variant="outlined"
                        color="primary"
                        aria-label="text primary button group"
                        fullWidth
                    >
                        <Button color="warning"
                                onClick={() => setShowEditDialog(false)}>Stäng
                        </Button>
                        <LoadingButton
                            variant={'outlined'}
                            type="submit"
                            loading={loading}
                            startIcon={<EditOutlinedIcon/>}
                        >
                            Ändra
                        </LoadingButton>
                    </ButtonGroup>

                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditSingleUserDialog;
