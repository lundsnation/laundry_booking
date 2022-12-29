import { Typography } from "@mui/material";


const NotAuthorized = () =>{
    return(
        <div
        style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        }}
    >
        <Typography variant="h2">Ej auktoriserad</Typography>
    </div>
    )
}

export default NotAuthorized;                   