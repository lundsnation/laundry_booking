import {Grid} from "@mui/material";
import {withPageAuthRequired} from '@auth0/nextjs-auth0';
import {NextPage} from "next";
import {useState} from "react";
import {Snack, SnackInterface} from
        "../src/frontend/components/Snack";
import EditProfile from "../src/frontend/components/profile/EditProfile";
import Layout from "../src/frontend/components/layout/Layout";
import User, {JsonUser} from "../src/frontend/models/User";

interface Props {
    user: JsonUser
}

const Profile: NextPage<Props> = ({user}: Props) => {

    const currentUser = new User(user, [])
    const [snack, setSnack] = useState<SnackInterface>({
        show: false,
        snackString: "",
        severity: "success"
    })

    const resetSnack = () => {
        setSnack({show: false, snackString: snack.snackString, severity: snack.severity})
    }

    return (
        <Layout user={currentUser}>
            <Snack state={snack} handleClose={resetSnack}/>
            <Grid container>
                <Grid item xs={12} mx={2} my={'10%'}>
                    <EditProfile initUser={currentUser} setSnack={setSnack}/>
                </Grid>

            </Grid>
        </Layout>
    )
}


export const getServerSideProps = withPageAuthRequired();

export default Profile