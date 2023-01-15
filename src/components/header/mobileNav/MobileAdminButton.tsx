import router from 'next/router';
import { Fab } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';


const AdminButton = () => {
    return (
        <Fab variant="extended" color="secondary" aria-label="add" onClick={() => { router.push("/admin") }}>
            <AdminPanelSettingsIcon />
        </Fab>
    )
}

export default AdminButton;