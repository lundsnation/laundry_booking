import { Grid } from "@mui/material";
import { UserProfile, useUser } from '@auth0/nextjs-auth0/client';
import { Session, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { NextPage } from "next";
import { useState } from "react";
import { UserType } from "../utils/types"
import { Snack, SnackInterface } from "../src/components/Snack";
import EditProfile from "../src/components/profile/EditProfile";
import Loading from "../src/components/Loading";
import router from "next/router";
import Layout from "../src/components/layout/Layout";
import User from "../src/classes/User";

interface Props {
    // currentUser: User
    user: UserType

}

const Profile: NextPage<Props> = ({ user }: Props) => {

    const currentUser: User = User.fromJSON(user)
    const [snack, setSnack] = useState<SnackInterface>({
        show: false,
        snackString: "",
        severity: "success"
    })

    const resetSnack = () => {
        setSnack({ show: false, snackString: snack.snackString, severity: snack.severity })
    }

    console.log("FROM PROFILE: " + currentUser.telephone)


    return (
        <Layout user={currentUser}>
            <Snack state={snack} handleClose={resetSnack} />
            <Grid container>
                <Grid item xs={12} mx={2} my={'10%'}>
                    <EditProfile user={currentUser} setSnack={setSnack} />
                </Grid>

            </Grid>
        </Layout >
    )
}


export const getServerSideProps = withPageAuthRequired();

export default Profile