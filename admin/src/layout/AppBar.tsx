import * as React from 'react';
import { AppBar, LocalesMenuButton, Logout, ToggleThemeButton, UserMenu, useTranslate } from 'react-admin';
import { Link } from 'react-router-dom';
import {
    Box,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Typography,
    useMediaQuery,
    Theme,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

import Logo from './Logo';
import { darkTheme, lightTheme } from '../layout/themes';

import DropDown from '../components/dropdown';

const ConfigurationMenu = React.forwardRef((props, ref) => {
    const translate = useTranslate();
    return (
        <MenuItem
            component={Link}
            // @ts-ignore
            ref={ref}
            {...props}
            to="/configuration"
        >
            <ListItemIcon>
                <SettingsIcon />
            </ListItemIcon>
            <ListItemText>{translate('pos.configuration')}</ListItemText>
        </MenuItem>
    );
});
const CustomUserMenu = (props: any) => (
    <>
        <UserMenu>
            <ConfigurationMenu />
            <Logout />
        </UserMenu>
        {props.scale && <Logo />}
    </>
);

const CustomAppBar = (props: any) => {
    const isLargeEnough = useMediaQuery<Theme>(theme =>
        theme.breakpoints.up('sm')
    );
    return (
        <AppBar
            {...props}
            color="secondary"
            elevation={1}
            userMenu={<CustomUserMenu scale={isLargeEnough} />}
            sx={{
                paddingTop: 1,
                paddingBottom: 1,
            }}
        >
            <Typography
                variant="h6"
                color="inherit"
                sx={{
                    flex: 1,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                }}
                id="react-admin-title"
            />
            {/* {isLargeEnough && <DropDown />} */}
            {/* {isLargeEnough && <Box component="span" sx={{ flex: 1 }} />} */}
            {/* {isLargeEnough && <ToggleThemeButton
                lightTheme={lightTheme}
                darkTheme={darkTheme} />}
            {isLargeEnough && <LocalesMenuButton 
                languages={[
                    { locale: 'en', name: 'English' },
                    { locale: 'de', name: 'Deutsch' },
                ]}/>} */}
        </AppBar>
    );
};

export default CustomAppBar;
