//Imoprt
import {Button, SwipeableDrawer, Tooltip, Typography} from "@mui/material"
import {Box} from "@mui/system";
import {useState} from "react";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import RulesText from "./RulesText";
import User from "../../models/User";

interface Props {
    user: User
}

const Rules = ({user}: Props) => {
    const [drawerOpen, setdrawerOpen] = useState<boolean>(false);


    const toggleDrawer = () => {
        setdrawerOpen(!drawerOpen);
    }


    const ruleText = (
        <Typography variant={'button'} sx={{textOrientation: 'upright', writingMode: 'vertical-lr'}}>
            Regler
        </Typography>
    )

    return (

        <Box sx={{display: {xs: 'none', sm: 'block'}}}>
            {!drawerOpen && <Tooltip
                placement={'right'}
                title={<> <KeyboardDoubleArrowRightIcon/></>}
            >
                <Button
                    variant={'outlined'}
                    onClick={toggleDrawer}
                    color="primary"
                    sx={{
                        display: {md: "inline-flex"},
                        zIndex: 'tooltip',
                        padding: 1,
                        minWidth: 40,
                        left: 0,
                        top: '30%',
                        position: 'fixed'
                    }}
                >

                    {ruleText}
                </Button>
            </Tooltip>}
            <SwipeableDrawer
                PaperProps={{
                    sx: {
                        width: 600
                    }
                }}
                open={drawerOpen}
                onClose={toggleDrawer}
                onOpen={toggleDrawer}
            >
                <RulesText user={user}/>
            </SwipeableDrawer>
        </Box>
    )
}

export default Rules;