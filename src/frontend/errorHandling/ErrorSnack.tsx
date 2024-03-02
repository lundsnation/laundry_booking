import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface Props {
    message: string;
}

export default function ErrorSnack({message}: Props) {
    const [open, setOpen] = React.useState(true);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <div>
            <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}
