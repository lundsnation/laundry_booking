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
    const [open, setOpen] = useState<boolean>(false);

    
    const toggleDrawer = () => {
        setOpen(!open);
    }


    return(
        <Box>
            <Tooltip
                placement = {'right'}
                sx = {{ zIndex: 'tooltip', left: 0, top: '40%', position: 'fixed' }}
                title={<> <KeyboardDoubleArrowRightIcon /></>}
            >
                <Button variant={'outlined'} onClick={toggleDrawer}>
                    <Typography>
                        R <br/> E <br/> G <br/> L <br/> E <br/> R
                    </Typography> 
                </Button>
            </Tooltip> 
            <SwipeableDrawer
            PaperProps={{
                sx: {
                    width: 300
                }
            }}
            open={open}
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