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
    DialogContent,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {LoadingButton} from "@mui/lab";
import PersonIcon from '@mui/icons-material/Person';
import User from "../../classes/User";

interface Props {
    showDeleteUserDialog: boolean,
    setShowDeleteUserDialog: (state: boolean) => void,
    selected: User[],
    handleDeleteUsers: () => void,
}

const DeleteUserDialog = ({
                              showDeleteUserDialog,
                              setShowDeleteUserDialog,
                              selected,
                              handleDeleteUsers,
                          }: Props) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        // Attempt to delete all selected users.
        handleDeleteUsers();

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
                            onClick={handleDelete}>
                            Ja
                        </LoadingButton>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteUserDialog;
