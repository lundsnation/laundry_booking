//Imoprt
import { Button, Drawer, Popper, SwipeableDrawer, Tooltip, Typography } from "@mui/material"
import { Box } from "@mui/system";
import { useState } from "react";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';


interface Props {

}

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

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {!drawerOpen && <Tooltip
                placement={'right'}
                title={<> <KeyboardDoubleArrowRightIcon /></>}
            >
                <Button
                    variant={'outlined'}
                    onClick={toggleDrawer}
                    sx={{
                        display: { md: "inline-flex" },
                        color: '#000000a6',
                        borderColor: '#000000a6',
                        zIndex: 'tooltip',
                        padding: 1,
                        minWidth: 40,
                        left: 0,
                        top: '40%',
                        position: 'fixed'
                    }}
                >

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