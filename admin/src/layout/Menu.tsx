import * as React from 'react';
import { useState } from 'react';
import {
    MenuItemLink,
    MenuProps,
    useSidebarState,
    useTranslate,
    DashboardMenuItem
} from 'react-admin';
import Box from '@mui/material/Box';
// import SubMenu from './SubMenu';
import users from '../users';
import products from '../products';
import orders from '../orders';
import invoices from '../invoices';
import notifications from '../notifications';

// type MenuName = 'menuOrders' | 'menuProducts' | 'menuUsers';

const Menu = ({ dense = false }: MenuProps) => {
    // const [state, setState] = useState({
    //     menuOrders: true,
    //     menuProducts: true,
    //     menuUsers: true,
    // });
    const [open] = useSidebarState();
    const translate = useTranslate();

    // const handleToggle = (menu: MenuName) => {
    //     setState(state => ({ ...state, [menu]: !state[menu] }));
    // };

    return (
        <Box
            sx={{
                width: open ? 200 : 50,
                marginTop: 1,
                marginBottom: 1,
                transition: theme =>
                    theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
            }}
        >
            <DashboardMenuItem />
            {/* <SubMenu
                handleToggle={() => handleToggle('menuProducts')}
                isOpen={state.menuProducts}
                name="resources.products.name"
                icon={<products.icon />}
                dense={dense}
            >
                <MenuItemLink
                    to="/products"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`resources.products.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<products.icon />}
                    dense={dense}
                />
            </SubMenu>
            <SubMenu
                handleToggle={() => handleToggle('menuUsers')}
                isOpen={state.menuUsers}
                name="resources.users.name"
                icon={<users.icon />}
                dense={dense}
            >
                <MenuItemLink
                    to="/users"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`resources.users.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<users.icon />}
                    dense={dense}
                />
            </SubMenu> */}            
            <MenuItemLink
                to="/orders"
                state={{ _scrollToTop: true }}
                primaryText={translate(`resources.orders.name`, {
                    smart_count: 1,
                })}
                leftIcon={<orders.icon />}
                dense={dense}
            />
            <MenuItemLink
                to="/invoices"
                state={{ _scrollToTop: true }}
                primaryText={translate(`resources.invoices.name`, {
                    smart_count: 1,
                })}
                leftIcon={<invoices.icon />}
                dense={dense}
            />
            <MenuItemLink
                to="/products"
                state={{ _scrollToTop: true }}
                primaryText={translate(`resources.products.name`, {
                    smart_count: 2,
                })}
                leftIcon={<products.icon />}
                dense={dense}
            />
            <MenuItemLink
                to="/users"
                state={{ _scrollToTop: true }}
                primaryText={translate(`resources.users.name`, {
                    smart_count: 2,
                })}
                leftIcon={<users.icon />}
                dense={dense}
            />
            <MenuItemLink
                to="/notifications"
                state={{ _scrollToTop: true }}
                primaryText={translate(`resources.notifications.name`, { smart_count: 2 })}
                leftIcon={<notifications.icon />}
                dense={dense}
            />
        </Box>
    );
};

export default Menu;
