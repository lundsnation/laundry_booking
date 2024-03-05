import router from 'next/router';
import { Fab, Typography } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';


const AdminButton = () => {
    return (
        <Fab sx={{ ml: 2 }} variant="extended" color="secondary" aria-label="add" onClick={() => { router.push("/admin") }}>
            <AdminPanelSettingsIcon />
            <Typography sx={{ display: { xs: "none", sm: "block" } }}>Admin</Typography>
        </Fab>
    )
}

export default AdminButton;