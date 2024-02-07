import React, {useState} from "react";
import {
    Button,
    Typography,
    Grid,
    Dialog,
    DialogActions,
    DialogTitle,
    List,
    ListItem,
    Divider,
    ListItemIcon,
    DialogContent
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {LoadingButton} from "@mui/lab";
import PersonIcon from '@mui/icons-material/Person';
import BackendAPI from "../../apiHandlers/BackendAPI";
import User from "../../classes/User";

interface Props {
    showDeleteUserDialog: boolean,
    setShowDeleteUserDialog: (state: boolean) => void,
    selected: User[],
    users: User[],
    setUsers: (users: User[]) => void,
    searchedUsers: User[],
    setSearchedUsers: (users: User[]) => void,
    setSnack: (message: string, severity: 'success' | 'error') => void,
}

const DeleteUserDialog = ({
                              showDeleteUserDialog,
                              setShowDeleteUserDialog,
                              selected,
                              users,
                              setUsers,
                              searchedUsers,
                              setSearchedUsers,
                              setSnack
                          }: Props) => {
    const [loading, setLoading] = useState(false);

    const handleDeleteUser = async () => {
        setLoading(true);
        // Attempt to delete all selected users.
        await Promise.all(selected.map(user => BackendAPI.deleteUser(user.sub)));

        // Update state only if all deletes are successful.
        const updatedUsers = users.filter(user => !selected.find(selectedUser => selectedUser.sub === user.sub));
        const updatedSearchedUsers = searchedUsers.filter(user => !selected.find(selectedUser => selectedUser.sub === user.sub));

        setUsers(updatedUsers);
        setSearchedUsers(updatedSearchedUsers);
        setSnack(`Tog bort ${selected.length} användare`, 'success');

        setLoading(false);
        setShowDeleteUserDialog(false);
    };

    const getUserNames = () => selected.map((user, index) => (
        <ListItem key={index}>
            <ListItemIcon>
                <PersonIcon/>
                {user.name}
            </ListItemIcon>
        </ListItem>
    ));

    return (
        <Dialog open={showDeleteUserDialog} onClose={() => setShowDeleteUserDialog(false)}>
            <DialogTitle>Radera Användare</DialogTitle>
            <Divider variant="middle"/>
            <DialogContent>
                <Typography>Är du säker på att du vill radera följande användare?</Typography>
                <List dense>{getUserNames()}</List>
            </DialogContent>
            <DialogActions>
                <Grid container alignItems="center" justifyContent="center">
                    <Grid item>
                        <Button
                            sx={{margin: "12px", marginTop: 0}}
                            color="warning"
                            variant="outlined"
                            onClick={() => setShowDeleteUserDialog(false)}>
                            Nej
                        </Button>
                    </Grid>
                    <Grid item>
                        <LoadingButton
                            type="submit"
                            loading={loading}
                            variant="outlined"
                            color="error"
                            endIcon={<DeleteOutlinedIcon/>}
                            sx={{margin: "12px", marginTop: 0}}
                            onClick={handleDeleteUser}>
                            Ja
                        </LoadingButton>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteUserDialog;
