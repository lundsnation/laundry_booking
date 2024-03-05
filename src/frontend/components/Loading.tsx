import {CircularProgress} from "@mui/material"
import React from 'react';

const Loading = () => {

    return (
        <div
            style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <object type="image/svg+xml" data="/LN24_gA.svg" style={{height: "12%", width: "12%"}}>svg-animation
            </object>
            <div style={{position: 'absolute'}}>
                <CircularProgress size="10rem" thickness={2} color="primary"/>
            </div>
        </div>
    )
}

export default Loading;

