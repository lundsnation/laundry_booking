import { Box, Container, Typography, Paper} from "@mui/material";
import { useUser } from '@auth0/nextjs-auth0/dist/frontend';
import { NextPage } from "next";
import NotLoggedIn from "../src/components/NotLoggedIn";
import NotAuthorized from "../src/components/NotAuthorized";
import { useState } from "react";
import { UserType } from "../utils/types";
import Header from "../src/components/Header";
import UserGrid from "../src/components/admin/UserGrid";
import { Snack, SnackInterface } from "../src/components/Snack";
import {Grid} from "@mui/material";

const admin: NextPage = () => {
    const { user, isLoading, error } = useUser()
    const [users, setUsers] = useState<Array<UserType>>([])
    const [rootSnack,setRootSnack] = useState<SnackInterface>({show:false,snackString:"",severity:"info"})

    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} flexGrow={1}>
                <Header/>
            </Grid>
            {user && !isLoading ?
            <Grid item xs={12}>
                <Box>
                    {user.name == "admin" ?  
                    <Paper>
                        <Snack handleClose={()=>{setRootSnack(rootSnack =>({...rootSnack,show:false}))}} state={rootSnack}></Snack>
                        <Typography variant="h5" sx={{paddingLeft:5}}>Användare:</Typography>
                            <UserGrid users={users} setUsers={setUsers} snack={rootSnack} setSnack={setRootSnack}/>
                        </Paper>
                        
                        :<NotAuthorized/>
                    }</Box></Grid>:<NotLoggedIn />
                
            }
        </Grid>
    )
}

export default admin