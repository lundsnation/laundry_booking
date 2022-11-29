// Component for displaying a single configurable snackbar on a given page
import {Snackbar, Alert, Container, AlertColor} from "@mui/material"
import React from "react";


// Inputs from parent, snackInterface contains variables responsible for setting states of the snackbar
// HandleClose is generally the stateModifier for visibility-boolean
interface props{
    state : SnackInterface,
    handleClose : () => void
}

export interface SnackInterface{
    show: boolean,
    snackString : string,
    // May be 'success' | 'info' | 'warning' | 'error';
    severity :  AlertColor
}

export const Snack = (props:props) => {

    return (
        <Container>
            <Snackbar open={props.state.show} autoHideDuration={3000} onClose = {props.handleClose}>
                <Alert severity={props.state.severity} color ={props.state.severity} sx={{ width: '100%' }}>{props.state.snackString}</Alert>
            </Snackbar>
        </Container>
    )
}


