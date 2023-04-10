import React, { useRef, useState } from 'react';
import { ClickAwayListener, Grow, IconButton, makeStyles, MenuItem, MenuList, Paper, Popper, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ReactComponent as UserIcon } from '../../assets/icons/user.svg';
import { FiUnlock } from 'react-icons/fi';
import { COLOR_FONT_DARK_GRAY } from '../../constants/color.constants';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/user.action';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    paper: {
        marginRight: theme.spacing(2),
    },
    button: {
        margin: theme.spacing(1)
    }
}))

const HeaderUser = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const { t } = useTranslation();
    const { userInfo } = useSelector((state) => state.userLogin);
    
    const handleLogout = () => {
        dispatch(logout());
    };

    const handleToogle = (() => {
        setOpen((prevOpen) => !prevOpen)
    });

    const handleClose = (e) => {
        if (anchorRef.current && anchorRef.current.contains(e.target)) {
            return;
        }
        setOpen(false);
    }

    const handleListKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            setOpen(false);
        }
    }

    return (
        <div className={classes.root}>
            <div>
                {userInfo ? (
                    <>
                        <IconButton ref={anchorRef} onClick={handleToogle}>
                            <UserIcon height={22} />
                        </IconButton>
                        <Popper
                            open={open}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            transition
                            disablePortal>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin:
                                            placement === 'bottom' ? 'center top' : 'center bottom',
                                    }}>
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <MenuList
                                                autoFocusItem={open}
                                                id='menu-list-grow'
                                                onKeyDown={handleListKeyDown}>
                                                <MenuItem component={RouterLink} to='/profile' divider>
                                                    { userInfo.nameLast ? userInfo.nameFist + ' ' + userInfo.nameLast : t('Profile') }
                                                </MenuItem>
                                                <MenuItem component={RouterLink} to='/order-list' divider>
                                                    { t('OrderList') }
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={handleLogout}>
                                                    {t('SignOut')}
                                                </MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </>
                )                
                : (
                    <Button
                        component={RouterLink}
                        to='/login'
                        className={classes.button}
                        startIcon={<FiUnlock height={24} color={COLOR_FONT_DARK_GRAY}></FiUnlock>}>
                        {t('SignIn')}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default HeaderUser;