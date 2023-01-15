import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { UserType } from '../../../../utils/types';
import { AccountCircle, Logout } from '@mui/icons-material/';
import { Button, ListItemIcon, MenuItem, SvgIconTypeMap } from '@mui/material';
import SvgIcon from '@mui/material';
import router from 'next/router';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface Props {
    user: UserType
}

type MenuItemType = {
    text: string,
    link: string,
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string; }
}

const menuItems: Array<MenuItemType> = [
    { text: "Profil", link: "/profile", Icon: AccountCircle },
    { text: "Logga ut", link: "api/auth/logout", Icon: Logout }
]

const ProfileMenuButton = (props: Props) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const user = props.user;

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

            <Tooltip title="Profil/Logga ut">
                <Button
                    size="large"
                    color={"inherit"}
                    startIcon={<AccountCircle />}
                    onClick={handleClick}
                    sx={{ ml: 2, color: "#FFFFFF" }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Typography
                        variant={"h6"}
                        fontSize={16}
                    >
                        {user.name}
                    </Typography>

                </Button>
            </Tooltip>

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

            </Menu>

        </React.Fragment >
    );
}

export default ProfileMenuButton;

