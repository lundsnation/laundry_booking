
import { CircularProgress } from "@mui/material"
import Image from "next/image";
import React from 'react';
import { useEffect } from "react";


const IMAGE_PATH = "/LN24_gA.svg"
const IMAGE_SCALE = 6
const IMAGE_SIZE = (24)
 
const Loading = () => {

    return(
        <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    ><object type="image/svg+xml" data="/LN24_gA.svg" style={{height: "12%", width: "12%"}}>svg-animation</object>
      <div style={{position: 'absolute'}}>
        <CircularProgress size="10rem" thickness={2} color="primary"/>
      </div>
    </div>
    )
}

export default Loading;

