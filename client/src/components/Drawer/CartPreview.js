import React from 'react';
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch, useSelector } from 'react-redux';
import emptyGif from '../../assets/images/Empty.gif';
import { removeFromCart, setOpenCartDrawer } from '../../actions/cart.actions';
import { Link as LinkRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { COLOR_BUTTON_PRIMARY_BACKGROUND, COLOR_WHITE } from '../../constants/color.constants';
import { currencyFormatter } from '../../utils'

const useStyles = makeStyles((theme) => ({
    root: {
      width: 400,
      height: '100%',
      padding: 20,
      backgroundColor: theme.palette.background.paper,
      [theme.breakpoints.down('xs')]: {
        width: 300,
      },
    },
    title: {
      ...theme.mixins.customize.flexMixin('space-between', 'center'),
    },
    large: {
      width: theme.spacing(12),
      height: theme.spacing(15),
    },
    listProduct: {
      overflowY: 'auto',
      maxHeight: '60%',
      marginTop: 10,
      marginBottom: 10,
      '&::-webkit-scrollbar': {
        width: 8,
      },
      '&::-webkit-scrollbar-thumb': {
        background: COLOR_BUTTON_PRIMARY_BACKGROUND
      },
      '&::-webkit-scrollbar-track': {
        background: 'rgba(245, 0, 87, 0.04)',
      },
      '& .MuiListItem-container:last-child > .MuiListItem-divider': {
        borderBottom: 'none',
      },
    },
    priceTotal: {
      ...theme.mixins.customize.flexMixin('space-between', 'center'),
      padding: '10px 0',
    },
    button: {
      margin: '10px 0',
      '& + $button': {
        marginTop: 2,
      },
    },
    empty: {
      ...theme.mixins.customize.centerFlex('column wrap'),
      marginTop: 30,
    },
  }));
  
const CartPreview = () => {  const classes = useStyles();
    const dispatch = useDispatch();
  
    const { t } = useTranslation();
    const isOpenDrawer = useSelector((state) => state.cartOpenDrawer);
    const { cartItems } = useSelector((state) => state.cart);
  
    const removeFromCartHandler = (id) => {
      dispatch(removeFromCart(id));
    };
  
    const onDrawerOpen = () => {
      dispatch(setOpenCartDrawer(true));
    };
  
    const onDrawerClose = () => {
      dispatch(setOpenCartDrawer(false));
    };
    
    return (
    <SwipeableDrawer
      anchor='right'
      open={isOpenDrawer}
      onClose={onDrawerClose}
      onOpen={onDrawerOpen}
    >
      <div className={classes.root}>
        <div className={classes.title}>
          <Typography variant='h5' component='h2' gutterBottom>
            {t('Cart')} ({cartItems.length} / {
              cartItems.reduce(function(prev, cur) {
                return parseInt(prev) + parseInt(cur.qty);
              }, 0)
            })
          </Typography>
          <IconButton style={{color:COLOR_BUTTON_PRIMARY_BACKGROUND}} onClick={onDrawerClose}>
            <ClearIcon />
          </IconButton>
        </div>
        <Divider variant='fullWidth' />
        {cartItems.length > 0 ? (
          <>
            <List className={classes.listProduct}>
              {cartItems.map((item) => {
                return(
                <ListItem divider disableGutters key={item.product}>
                  <ListItemAvatar>
                    <Avatar
                      variant='square'
                      src={item.images ? item.images[0].url : ''}
                      alt='product image'
                      className={classes.large}
                    ></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`${item.qty} x ${
                      currencyFormatter.format(item.price) 
                    }`}
                    style={{ marginLeft: 10 }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge='end'
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>);
              })}
            </List>
            <Divider variant='fullWidth' />
            <div className={classes.priceTotal}>
              <Typography variant='subtitle1' component='span'>
                {t('PriceNetto')}:
              </Typography>
              <Typography
                variant='subtitle1'
                component='span'
                style={{ color:COLOR_BUTTON_PRIMARY_BACKGROUND, fontWeight: 600, fontSize: 18 }}
              >
                {currencyFormatter.format(cartItems
                  .reduce((acc, item) => acc + item.price * item.qty, 0))}
              </Typography>
            </div>
            <Divider variant='fullWidth' />
            <Button
              variant='contained'
              color='primary'
              fullWidth
              component={RouterLink}
              to='/cart'
              onClick={onDrawerClose}
              className={classes.button}
            >
              {t('ViewShoppingCart')}
            </Button>
            <Button
              variant='contained'
              // color='secondary'
              style={{
                color: COLOR_WHITE,
                backgroundColor: COLOR_BUTTON_PRIMARY_BACKGROUND
              }}
              fullWidth
              className={classes.button}
              component={RouterLink}
              to='/checkout'
              onClick={onDrawerClose}
            >
              {t('Checkout')}
            </Button>
          </>
        ) : (
          <div className={classes.empty}>
            <Typography variant='subtitle1' style={{color:COLOR_BUTTON_PRIMARY_BACKGROUND}} >
              {t('YourCartIsEmpty') + ' '}
              <Link
                to='/shop'
                component={LinkRouter}
                color='primary'
                onClick={onDrawerClose}
              >
                {t('ShoppingNow')}
              </Link>
            </Typography>
            <img src={emptyGif} alt='empty' />
          </div>
        )}
      </div>
    </SwipeableDrawer>
    );
};

export default CartPreview;