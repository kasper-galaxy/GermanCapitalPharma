import React, { useState } from 'react';
import clsx from 'clsx';
import { 
    AppBar,
    Badge,
    Drawer,
    Hidden,
    IconButton,
    makeStyles,
    MenuItem,
    MenuList,
    Toolbar,
    useMediaQuery, 
    useScrollTrigger,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
    COLOR_BUTTON_PRIMARY_BACKGROUND,
    COLOR_FONT_DARK_GRAY, 
    COLOR_WHITE 
} from '../constants/color.constants';
import SearchBox from './SearchBox';
import logo from '../assets/images/logo.png';
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import { ReactComponent as CartIcon } from '../assets/icons/cart.svg';
import HeaderLanguage from './Header/HeaderLanguage';
import HeaderUser from './Header/HeaderUser';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/user.action';
import { setOpenCartDrawer } from '../actions/cart.actions';

const useStyles = makeStyles((theme) => ({
    header: {
        backgroundColor: COLOR_WHITE,
        color: COLOR_FONT_DARK_GRAY,
        transition: 'all .2s',
        boxShadow: '0px 2px 8px -1px rgb(0 0 0 / 10%)',
        paddingRight: '0 !important',
        zIndex: 100,
        paddingTop: "8px",
        paddingBottom: "8px",
    },
    header2: {
        backgroundColor: COLOR_WHITE,
        color: COLOR_FONT_DARK_GRAY,
        transition: 'all .2s',
        boxShadow: '0px 2px 8px -1px rgb(0 0 0 / 10%)',
        paddingRight: '0 !important',
        zIndex: 100,
    },
    logoWrapper: {
      flexBasis: '10%',
      width: '100%',
      display: 'flex',
      justifyContent: 'start',
      alignItems: 'start',
    },
    logo: {
      flexGrow: 1,
      maxWidth: 140,
      [theme.breakpoints.down('sm')]: {
        maxWidth: 120,
        marginLeft: 16,
      },
    },
    navMenu: {
      flexBasis: '45%',
      maxWidth: '45%',
      padding: 0,
      [theme.breakpoints.down('sm')]: {
        flexBasis: 'unset',
        maxWidth: 'unset',
      },
    },
    navList: {
      display: 'flex',
    },
    sectionDesktop: {
        flexBasis: '45%',
        maxWidth: '45%',
        ...theme.mixins.customize.flexMixin('flex-end', 'center'),
        [theme.breakpoints.down('sm')]: {
          flexBasis: 'unset',
          maxWidth: 'unset',
          flexGrow: 1,
        },
    },
    menuButton: {
        display: 'none',
        marginRight: theme.spacing(2),
        '@media(max-width: 740px)': {
          display: 'block',
        },
    },
    drawer: {
        width: 250
    },
    navListMobile: {
        width: '250px',
        marginTop: 50,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        '& .MuiListItem-root': {
          width: '100%',
          justifyContent: 'center',
        },
    },
    closeButton: {
        position: 'fixed',
        top: 10,
        left: 20,
    },
}));

const Header = (props) => {
    const [mobile, setMobile] = useState(false);
    const [openSearchDrawer, setOpenSearchDrawer] = useState(false);
    const onMobile = useMediaQuery('(max-width:740px)');
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useStyles({ mobile });
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.userLogin);
    
    const trigger = useScrollTrigger({
      disableHysteresis: true,
      target: window ? window : undefined,
      threshold: 80,
    });

    const handleCloseDrawer = () => {
        setMobile(false);
    };
    
    return (
        <AppBar
            position='fixed'
            className={clsx(classes.header, trigger && classes.header2)}>
            {onMobile ? (
                <Toolbar>
                    <Toolbar className={classes.navMenu}>                 
                        <IconButton
                            edge='start'
                            className={classes.menuButton}
                            onClick={() => setMobile(!mobile)}
                            color='inherit'
                            aria-label='open drawer'>
                                <MenuIcon />
                        </IconButton>
                        <Drawer
                            variant='temporary'
                            anchor='left'
                            className={classes.drawer}
                            open={mobile}
                            onClose={handleCloseDrawer}
                            ModalProps={{
                                keepMounted: true,
                                disablePortal: true
                            }}>
                            <MenuList className={classes.navListMobile} role='presentation'>
                                <MenuItem
                                    component={Link}
                                    to='/'
                                    className='navItem'
                                    style={{ marginLeft: onMobile ? 0 : -16 }}
                                    onClick={handleCloseDrawer}>
                                    {t('Home')}
                                </MenuItem>
                                <MenuItem
                                    component={Link}
                                    to='/shop'
                                    onClick={handleCloseDrawer}>
                                    {t('Shop')}
                                </MenuItem>
                                <MenuItem
                                    component={Link}
                                    to='/'
                                    divider
                                    onClick={handleCloseDrawer}>
                                    {t('AboutUs')}
                                </MenuItem>
                                { userInfo ? (
                                    <div style={{ width: '100%' }}>
                                        <MenuItem
                                            component={Link}
                                            to='/profile'
                                            divider
                                            onClick={handleCloseDrawer}>
                                            {userInfo.nameLast ? userInfo.nameFirst + ' ' + userInfo.nameLast : t('Profile')}
                                        </MenuItem>
                                        <MenuItem
                                            component={Link}
                                            to='/order-list'
                                            divider
                                            onClick={handleCloseDrawer}>
                                            {t('OrderList')}
                                        </MenuItem>
                                        <MenuItem onClick={() => dispatch(logout())}>
                                            {t('SignOut')}
                                        </MenuItem>
                                    </div>
                                ) : (
                                    <MenuItem
                                        component={Link}
                                        to='/login'>
                                        {t('SignIn')}
                                    </MenuItem>
                                ) }
                            </MenuList>
                            <IconButton
                                edge='start'
                                className={classes.closeButton}
                                onClick={() => setMobile(false)}
                                color='inherit'
                                aria-label='close drawer'>
                                <CloseIcon />
                            </IconButton>
                        </Drawer>
                    </Toolbar>
                    <Link to='/' className={classes.logoWrapper}>
                        <img src={logo} alt='logo' className={classes.logo} />
                    </Link>
                    <div className={classes.sectionDesktop}>
                        <IconButton color='inherit' onClick={() => setOpenSearchDrawer(true)}>
                            <SearchIcon height={22} width={22} />
                        </IconButton>

                        <Drawer
                            anchor='top'
                            open={openSearchDrawer}
                            onClose={() => setOpenSearchDrawer(false)}>
                            <SearchBox 
                                role='searchDrawer'
                                setOpenSearchDrawer={setOpenSearchDrawer}/>
                        </Drawer>
                        
                        {userInfo && userInfo.userVerified && <IconButton
                            color='inherit'
                            onClick={() => dispatch(setOpenCartDrawer(true))}>
                            <Badge
                                badgeContent={cartItems.reduce(function(prev, cur) {
                                    return parseInt(prev) + parseInt(cur.qty);
                                  }, 0)} 
                                style={{color: COLOR_BUTTON_PRIMARY_BACKGROUND}}>
                                <CartIcon />
                            </Badge>
                        </IconButton>}

                        <HeaderLanguage />
                        <Hidden smDown>
                            <HeaderUser />
                        </Hidden>
                    </div>
                </Toolbar>
            ) : (
                <Toolbar>
                    <Link to='/' className={classes.logoWrapper}>
                        <img src={logo} alt='logo' className={classes.logo} />
                    </Link>

                    <Toolbar className={classes.navMenu}>
                        <MenuList className={classes.navList} role='presentation'>
                            <MenuItem
                                disableRipple
                                component={Link}
                                to='/'
                                className='navItem'
                                style={{
                                    marginLeft: "-16"
                                }}>
                                {t('Home')}
                            </MenuItem>
                            <MenuItem
                                disableRipple
                                component={Link}
                                to='/shop'
                                className='navItem'>
                                {t('Shop')}
                            </MenuItem>
                            <MenuItem
                                disableRipple
                                component={Link}
                                to='/'
                                className='navItem'>
                                {t('AboutUs')}
                            </MenuItem>
                        </MenuList>
                    </Toolbar>
                    <div className={classes.sectionDesktop}>
                        <IconButton color='inherit' onClick={() => setOpenSearchDrawer(true)}>
                            <SearchIcon height={22} width={22} />
                        </IconButton>

                        <Drawer
                            anchor='top'
                            open={openSearchDrawer}
                            onClose={() => setOpenSearchDrawer(false)}>
                            <SearchBox 
                                role="searchDrawer"
                                setOpenSearchDrawer={setOpenSearchDrawer}
                            />
                        </Drawer>

                        {userInfo && userInfo.userVerified && <IconButton
                                        color='inherit'
                                        onClick={() => dispatch(setOpenCartDrawer(true))}>
                            <Badge
                                badgeContent={cartItems.reduce(function(prev, cur) {
                                    return parseInt(prev) + parseInt(cur.qty);
                                  }, 0)}
                                style={{ color: COLOR_BUTTON_PRIMARY_BACKGROUND }}>
                                <CartIcon />
                            </Badge>                           
                        </IconButton>}

                        <Hidden smDown>
                            <HeaderLanguage />
                        </Hidden>
                        <Hidden smDown>
                            <HeaderUser />
                        </Hidden>
                    </div>
                </Toolbar>
            )}
        </AppBar>
    );
}

export default Header;