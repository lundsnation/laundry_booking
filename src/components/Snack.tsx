// Component for displaying a single configurable snackbar on a given page
import {Snackbar, Alert, Container, AlertColor, SnackbarOrigin} from "@mui/material"
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
    alignment?: SnackbarOrigin,
}

export const Snack = (props: props) => {
const anchororigin = props.state.alignment;
    return (
        <Container>
            <Snackbar open={props.state.show} autoHideDuration={3000} onClose = {props.handleClose} anchorOrigin = { anchororigin } key = { String(anchororigin?.vertical+","+anchororigin?.horizontal)}>
                <Alert severity={props.state.severity} color ={props.state.severity} sx={{ width: '100%' }}>{props.state.snackString}</Alert>
            </Snackbar>
        </Container>
    )
}


