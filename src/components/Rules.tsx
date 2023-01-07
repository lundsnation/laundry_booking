//Imoprt
import { Button, Drawer, Popper, SwipeableDrawer, Tooltip, Typography } from "@mui/material"
import { Box } from "@mui/system";
import { useState } from "react";
import { positions } from '@mui/system';
import zIndex from "@mui/material/styles/zIndex";
import mt from "date-fns/locale/mt";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';


interface Props {

}

//{z-index:999;right:0;top:50%;margin-top:-25px;width:50px;height:50px;position:fixed}

const Rules = (props: Props) => {
    const [drawerOpen, setdrawerOpen] = useState<boolean>(false);


    const toggleDrawer = () => {
        setdrawerOpen(!drawerOpen);
    }


    const ruleText = (
        <Typography variant={'button'} sx={{ textOrientation: 'upright', writingMode: 'vertical-lr' }}>
            Regler
        </Typography>
    )



    return (
        <Box>
            {!drawerOpen && <Tooltip
                placement={'right'}
                title={<> <KeyboardDoubleArrowRightIcon /></>}
            >
                <Button
                    variant={'outlined'}
                    onClick={toggleDrawer}
                    sx={{
                        hoverColor: 'red',
                        color: '#000000a6',
                        borderColor: '#000000a6',
                        zIndex: 'tooltip',
                        padding: 1,
                        minWidth: 40,
                        left: 0,
                        top: '40%',
                        position: 'fixed'
                    }}>
                    {ruleText}
                </Button>
            </Tooltip>}
            <SwipeableDrawer
                PaperProps={{
                    sx: {
                        width: 300
                    }
                }}
                open={drawerOpen}
                onClose={toggleDrawer}
                onOpen={toggleDrawer}
            >
                <Typography>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione ea, impedit similique adipisci sit praesentium aliquid culpa distinctio voluptatibus accusamus quia cupiditate sapiente nihil inventore obcaecati mollitia repellat veniam esse.
                </Typography>
            </SwipeableDrawer>
        </Box>
    )
}

export default Rules;