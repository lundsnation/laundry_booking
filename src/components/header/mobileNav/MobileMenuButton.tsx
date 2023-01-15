import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { UserType } from '../../../../utils/types';
import { AccountCircle, Logout } from '@mui/icons-material/';
import { ListItemIcon, MenuItem, SvgIconTypeMap } from '@mui/material';
import router from 'next/router';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import Hamburger from 'hamburger-react';
import GavelIcon from '@mui/icons-material/Gavel';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';

interface Props {
    user: UserType
}

type MenuItemType = {
    text: string,
    link: string,
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string; }
}

const menuItems: Array<MenuItemType> = [
    { text: 'Boka', link: "/", Icon: LocalLaundryServiceIcon },
    { text: "Regler", link: "/rules", Icon: GavelIcon },
    { text: "Profil", link: "/profile", Icon: AccountCircle },
    //{ text: "Logga ut", link: "api/auth/logout", Icon: Logout }
]

const MobileMenuButton = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onClick = (link: string) => {
        router.push(link);
    }

    return (
        <React.Fragment>
            <IconButton
                size="small"
                color={"inherit"}
                onClick={handleClick}
                sx={{ color: "#FFFFFF" }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                <Hamburger toggled={open} size={24} />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                keepMounted
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {menuItems.map(({ text, link, Icon }) => (
                    <MenuItem
                        key={text}
                        onClick={() => onClick(link)}
                    >
                        <ListItemIcon>
                            <Icon fontSize='medium' />
                        </ListItemIcon>
                        <Typography
                        >
                            {text}
                        </Typography>

                    </MenuItem>
                ))}
                {/*Logga ut knappen läggs till separat pga röd färg*/}
                <MenuItem
                    key={"Logga ut"}
                    onClick={() => onClick("api/auth/logout")}
                >
                    <ListItemIcon>
                        <Logout color={"error"} fontSize='medium' />
                    </ListItemIcon>
                    <Typography
                        color={"error"}
                    >
                        {"Logga ut"}
                    </Typography>

                </MenuItem>


            </Menu>

        </React.Fragment >
    );
}

export default MobileMenuButton;

