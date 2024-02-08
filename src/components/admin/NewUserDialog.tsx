import React, {useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Divider,
    Grid,
    List,
    ListItem,
    MenuItem, SnackbarOrigin,
    TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {LoadingButton} from '@mui/lab';
import User, {NewUser} from '../../classes/User';
import {SnackInterface} from "../Snack";
import Config, {LaundryBuilding, Building} from "../../configs/Config";
import BackendAPI from '../../apiHandlers/BackendAPI';

const initialNewUserState: NewUser = {
    name: "",
    email: "",
    connection: "Username-Password-Authentication",
    password: "",
    email_verified: true,
    app_metadata: {
        allowedSlots: 1,
        laundryBuilding: LaundryBuilding.NATIONSHUSET,
        roles: ['user'],
        acceptedTerms: false,
    },
    user_metadata: {
        telephone: "",
    }
};

interface Props {
    showAddDialog: boolean,
    setShowAddDialog: (state: boolean) => void,
    snack: SnackInterface,
    setSnack: (snackState: SnackInterface) => void,
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const alignment: SnackbarOrigin = {vertical: 'bottom', horizontal: 'left'};

function NewUserDialog({showAddDialog, setShowAddDialog, setSnack, setUsers}: Props) {
    const [newUser, setNewUser] = useState(initialNewUserState);
    const [building, setBuilding] = useState<Building>(Config.getBuildings[0]);
    const [roomNbr, setRoomNbr] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRoomNbrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        if (/^\d{0,4}$/.test(newValue)) {
            setRoomNbr(newValue);
        }
    };

    const handleAllowedSlotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        if (/^\d{0,2}$/.test(newValue)) {
            setNewUser((prev) => ({
                ...prev,
                app_metadata: {
                    ...prev.app_metadata,
                    allowedSlots: parseInt(newValue),
                },
            }));
        }
    }

    const handleLaundryBuildingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value as LaundryBuilding;
        setNewUser((prev) => ({
            ...prev,
            app_metadata: {
                ...prev.app_metadata,
                laundryBuilding: value,
            },
        }));
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (/^\d{0,4}$/.test(newValue)) {
            setNewUser((prev) => ({
                ...prev,
                password: newValue,
            }));
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setNewUser((prev) => ({
            ...prev,
            email: newValue,
        }));
    }

    //
    const handleTelephoneNbrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setNewUser((prev) => ({
            ...prev,
            user_metadata: {
                ...prev.user_metadata,
                telephone: newValue,
            },
        }));
    }

    const handleCreateUser = async (event: any) => {
        event.preventDefault();
        setIsLoading(true);

        const name = `${building}${roomNbr}`;
        const newUserWithName: NewUser = {
            ...newUser,
            name,
        };

        const user = await BackendAPI.createUser(newUserWithName);

        setIsLoading(false);

        setSnack({
            show: true,
            snackString: `Created ${user.name}`,
            severity: 'success',
            alignment,
        });

        setNewUser(initialNewUserState);
        setShowAddDialog(false);
        setUsers((prevUsers) => [...prevUsers, user]);
    }


    const handleCloseDialog = () => setShowAddDialog(false);

    return (
        <Dialog open={showAddDialog} onClose={handleCloseDialog}>
            <DialogTitle>Add New User</DialogTitle>
            <Divider variant="middle"/>
            <form onSubmit={handleCreateUser}>
                <List>
                    {/* Building Selection */}
                    <ListItem>
                        <TextField
                            id="select-building"
                            label="Select Building"
                            name="building"
                            margin="dense"
                            select
                            fullWidth
                            helperText={"Välj byggnad"}
                            value={building}
                            onChange={(e) => setBuilding(e.target.value as Building)}
                        >
                            {Config.getBuildings.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </ListItem>

                    {/* Room Number */}
                    <ListItem>
                        <TextField
                            id="room-number"
                            required={true}
                            label="Rums-/lägenhetsnummer,"
                            name="roomNbr"
                            margin="dense"
                            type={"number"}
                            fullWidth
                            value={roomNbr}
                            onChange={handleRoomNbrChange}
                            helperText={"4 siffror"}
                            inputMode={"numeric"}
                        />
                    </ListItem>

                    {/* Allowed Slots */}
                    <ListItem>
                        <TextField
                            id="allowed-slots"
                            required={true}
                            label="Tillåtna bokningar"
                            name="allowedSlots"
                            margin="dense"
                            fullWidth
                            value={newUser.app_metadata.allowedSlots}
                            onChange={handleAllowedSlotsChange}
                            helperText={"0-99"}
                            inputMode={"numeric"}
                        />
                    </ListItem>

                    {/* Laundry Building */}
                    <ListItem>
                        <TextField
                            id="laundry-building"
                            margin="dense"
                            select
                            fullWidth
                            value={newUser.app_metadata.laundryBuilding}
                            onChange={handleLaundryBuildingChange}
                            label="Tvättstuga"
                            helperText="Välj tvättstuga för användaren"
                        >
                            {Config.getLaundryBuildings.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </ListItem>

                    {/* Email */}
                    <ListItem>
                        <TextField
                            id="email"
                            required={true}
                            label="Email"
                            name="email"
                            margin="dense"
                            type={"email"}
                            fullWidth
                            value={newUser.email}
                            onChange={handleEmailChange}
                            helperText={"Användarens emailadress"}
                        />
                    </ListItem>

                    {/* Telephone */}
                    <ListItem>
                        <TextField
                            id="telephone"
                            label="Telefonnummer"
                            name="telephone"
                            margin="dense"
                            fullWidth
                            value={newUser.user_metadata.telephone || ""}
                            onChange={handleTelephoneNbrChange}
                            helperText={"Riktnummer enbart vid utländskt nummer"}
                        />
                    </ListItem>

                    {/* Password */}
                    <ListItem>
                        <TextField
                            id="password"
                            required={true}
                            label="Lösenord"
                            name="password"
                            margin="dense"
                            fullWidth
                            value={newUser.password}
                            onChange={handlePasswordChange}
                            helperText={"4 siffror (användaren ändrar i profil sedan)"}
                        />
                    </ListItem>


                </List>
                <DialogActions>
                    <Grid container alignItems="center" justifyContent="center">
                        <Button color="warning" variant="outlined" onClick={handleCloseDialog}>Close</Button>
                        <LoadingButton
                            type="submit"
                            loading={isLoading}
                            variant="outlined"
                            endIcon={<AddIcon/>}
                            sx={{margin: "12px", marginTop: 0}}
                        >
                            Skapa
                        </LoadingButton>
                    </Grid>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default NewUserDialog;
