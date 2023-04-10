import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { GrLocation, GrCreditCard, GrProjects } from 'react-icons/gr';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Meta from '../components/Meta';
import { calcTaxPerVAT, currencyFormatter, taxFormatter } from '../utils';
import { useTranslation } from 'react-i18next';
import { COLOR_BUTTON_PRIMARY_BACKGROUND, COLOR_WHITE } from '../constants/color.constants';
import {
    Button,
    Container,
    Grid,
    Paper,
    Typography,
    Breadcrumbs,
    Link,
    Divider,
    ListItemText,
    ListItem,
    List,
    ListItemIcon,
    Avatar,
    Box,
    Hidden,
    ListItemAvatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
  } from '@material-ui/core';
import { openSnackbar } from '../actions/snackbar.action';
import { CART_CLEAR_ITEMS } from '../constants/cart.constant';
import { placeOrder } from '../actions/order.actions';
import { ORDER_PLACE_RESET } from '../constants/order.constant';
import Loader from '../components/Loader';
import Message from '../components/Message';

const useStyles = makeStyles((theme) => ({
    breadcrumbsContainer: {
      ...theme.mixins.customize.breadcrumbs,
    },
    content: {
      padding: 24,
      boxShadow: '0 10px 31px 0 rgba(0,0,0,0.05)',
      [theme.breakpoints.down('sm')]: {
        padding: 32,
      },
    },
    form: {
      marginTop: 16,
      '& > *': {
        marginBottom: 16,
      },
    },
    banner: {
      width: '100%',
      height: 380,
    },
    orderItems: {
      flexWrap: 'wrap',
      paddingRight: 0,
    },
    items: {
      flexBasis: '100%',
      marginLeft: 56,
      [theme.breakpoints.down('xs')]: {
        marginLeft: 0,
      },
      '& .MuiTableCell-root': {
        paddingLeft: 0,
      },
      '& .MuiTableCell-head': {
        color: 'rgba(0, 0, 0, 0.54)',
        fontWeight: 400,
      },
    },
    largeImage: {
      width: theme.spacing(6),
      height: theme.spacing(8),
    },
    empty: {
      ...theme.mixins.customize.centerFlex('column wrap'),
      marginTop: 30,
    },
    cartTotalWrapper: {
      marginTop: 22,
      padding: 20,
      fontSize: 16,
      backgroundColor: '#F4F4F4',
    },
    cartTotal: {
      fontSize: 18,
      marginBottom: 8,
      '&:nth-child(2)': {
        // color: theme.palette.secondary.main,
        color: COLOR_BUTTON_PRIMARY_BACKGROUND
      },
    },
    divider: {
      margin: '8px 0',
      width: 80,
      height: 2,
      backgroundColor: '#2a2a2a',
    },
    itemName: {
      ...theme.mixins.customize.textClamp(2),
    },
    linkColor: {
        color: '#000'
    }
  }));

const CheckoutScreen = ({ history }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { t } = useTranslation();

    const local_rebuy_cart = localStorage.getItem('rebuy') === null ? undefined : {...JSON.parse(localStorage.getItem('rebuy'))}
    const state_cart = useSelector((state) => state.cart);
    const cart = local_rebuy_cart || state_cart;
    const { userInfo } = useSelector((state) => state.userLogin);
    const { loading, error, IsSuccess, orderInfo } = useSelector((state) => state.orderPlace);
    
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const formatAddress = (address) => {
        return address.street + ' ' + address.house + ', ' + address.zipcode + ' ' + address.city;
    };

    const placeOrderHandler = () => {
        console.log('placeOrderHandler');
        console.log(userInfo);
        console.log(cart);
        
        dispatch(placeOrder({
            cartData: cart
        }));
    };
      
    useEffect(() => {
        if (userInfo) {
        }
    }, [userInfo, history]);

    useEffect(() => {
        if (cart.cartItems.length === 0) {
            history.push('/shop');
        } else {
            console.log(cart);
        }
    }, [cart, history]);

    useEffect(() => {
        console.log('place order info ', orderInfo);
        if (IsSuccess && orderInfo) {
            // dispatch(openSnackbar(t('PlaceOrderSuccess'), 'success'));
            if (!local_rebuy_cart) {
                dispatch({ type: ORDER_PLACE_RESET });
                dispatch({ type: CART_CLEAR_ITEMS });
            } else {
                localStorage.removeItem('rebuy');
            }
            history.push(`/checkout/${orderInfo.id}`);
        }
    }, [loading, error, IsSuccess, orderInfo, dispatch, history, openSnackbar]);
    
    cart.itemsPrice = addDecimals(
        cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
    cart.taxPrice = addDecimals(
        cart.cartItems.reduce((acc, item) => acc + item.price * item.qty * item.vat, 0)
    );
    cart.totalPrice = (
        Number(cart.itemsPrice) +
        // Number(cart.shippingPrice) +
        Number(cart.taxPrice)
    ).toFixed(2);
    cart.paymentMethod = t('AccountPay');
    cart.itemsAmount = addDecimals(
        cart.cartItems.reduce(function(prev, cur) {
            return parseInt(prev) + parseInt(cur.qty);
          }, 0)
    );

    const vats = calcTaxPerVAT(cart.cartItems);

    return (
        <Container maxWidth='xl' style={{ marginBottom: 48 }}>
            <Meta title={t('Checkout') + ' | ' + t('PharmacyStore')} />
            <Grid container className={classes.breadcrumbsContainer}>
                <Grid item xs={12}>
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize='small' />}
                        style={{ marginBottom: 24 }}>
                        <Link className={classes.linkColor} component={RouterLink} to='/'>
                            {t('Home')}
                        </Link>
                        <Link className={classes.linkColor} component={RouterLink} to='/cart'>
                            {t('Cart')}
                        </Link>
                        <Link color='textPrimary' component={RouterLink} to='/checkout'>
                            {t('Checkout')}
                        </Link>
                    </Breadcrumbs>
                </Grid>
            </Grid>
            {(loading || error) && 
                <Box my={2} mt={4}>
                    {loading && <Loader my={0} />}
                    {error && <Message mt={0}>{error}</Message>}                                
                </Box>
            }
            <Paper elevation={0} className={classes.content}>
                <Grid container spacing={8}>
                    <Grid item xs={12} lg={8}>
                        <List>
                            <ListItem divider>
                                <ListItemIcon>
                                    <GrLocation fontSize={22} />
                                </ListItemIcon>
                                <ListItemText primary={t('Shipping')} secondary={userInfo && formatAddress(userInfo.address)} />
                            </ListItem>
                            <ListItem divider>
                                <ListItemIcon>
                                    <GrCreditCard fontSize={22} />
                                </ListItemIcon>
                                <ListItemText primary={t('PaymentMethod')}/>
                            </ListItem>
                            <ListItem className={classes.orderItems}>
                                <ListItemIcon>
                                    <GrProjects fontSize={22} />
                                </ListItemIcon>
                                <ListItemText primary={t('OrderItems')} />
                                {cart.cartItems.length > 0 ? (
                                <div className={classes.items}>
                                    <TableContainer component={Paper} elevation={0}>
                                    <Table>
                                        <TableHead>
                                        <TableRow>
                                            <TableCell>{t('Products')}</TableCell>
                                            <Hidden smDown>
                                            {/* <TableCell align='right'>{t('Home')}{lang.Size}</TableCell> */}
                                            <TableCell align='right'>{t('PriceNetto')}</TableCell>
                                            <TableCell align='right'>{t('VAT')}</TableCell>
                                            <TableCell align='right'>{t('Price')}</TableCell>
                                            </Hidden>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {cart.cartItems.map((item) => (
                                            <TableRow key={item.name}>
                                            <TableCell component='th' scope='item'>
                                                <ListItem disableGutters>
                                                <ListItemAvatar>
                                                    <Avatar
                                                    variant='square'
                                                    src={item.images && item.images[0].url}
                                                    alt='product image'
                                                    className={classes.largeImage}
                                                    ></Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={item.name}
                                                    className={classes.itemName}
                                                    style={{ marginLeft: 16 }}
                                                />
                                                </ListItem>
                                                <Hidden mdUp>
                                                <Box
                                                    display='flex'
                                                    justifyContent='space-between'
                                                    alignItems='center'
                                                    mt={2}
                                                >
                                                    <Box textAlign='center'>
                                                    {`${item.qty} x ${currencyFormatter.format(item.price)} = ${
                                                        currencyFormatter.format(item.qty * item.price)
                                                    } `} 
                                                    </Box>
                                                    <Box textAlign='center'>
                                                    {`${currencyFormatter.format(item.qty * item.price * item.vat)}  (${taxFormatter.format(item.vat)})`}
                                                    </Box>
                                                    <Box textAlign='center'>
                                                    {`${currencyFormatter.format(item.qty * item.price * (1 + item.vat))}`}
                                                    </Box>
                                                </Box>
                                                </Hidden>
                                            </TableCell>
                                            <Hidden smDown>
                                                <TableCell align='right'>
                                                {`${item.qty} x ${currencyFormatter.format(item.price)} = ${
                                                    currencyFormatter.format(item.qty * item.price)
                                                } `} 
                                                </TableCell>
                                                <TableCell align='right'>
                                                {`${currencyFormatter.format(item.qty * item.price * item.vat)}  (${taxFormatter.format(item.vat)})`}
                                                </TableCell>
                                                <TableCell align='right'>
                                                {`${currencyFormatter.format(item.qty * item.price * (1 + item.vat))}`}
                                                </TableCell>
                                            </Hidden>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                    </TableContainer>
                                </div>
                                ) : (
                                <div className={classes.empty}>
                                    <Typography variant='subtitle1' style={{color:COLOR_BUTTON_PRIMARY_BACKGROUND}} >
                                    {t('YourCartIsEmpty')}
                                    <Link to='/' component={RouterLink} color='primary'>
                                        {t('ShoppingNow')}
                                    </Link>
                                    </Typography>
                                </div>
                                )}
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <Paper elevation={0} className={classes.cartTotalWrapper}>
                            <Typography variant='h4' style={{ fontSize: 23 }}>
                                {t('OrderSummary')}
                            </Typography>
                            <Divider className={classes.divider} />
                            <List style={{ padding: '10px 20px 20px' }}>
                                <ListItem divider disableGutters>
                                    <ListItemText primary={t('Items')+':'} />
                                    <Typography>{parseInt(cart.itemsAmount)}</Typography>
                                </ListItem>
                                <ListItem divider disableGutters>
                                    <ListItemText primary={t('PriceNetto')+':'} />
                                    <Typography>{currencyFormatter.format(cart.itemsPrice)}</Typography>
                                </ListItem>
                                {/* <ListItem divider disableGutters>
                                    <ListItemText primary={t('Shipping')+':'} />
                                    <Typography>{currencyFormatter.format(cart.shippingPrice)}</Typography>
                                </ListItem> */}
                                { vats.map(vat => (
                                    <ListItem key={vat.vat} divider disableGutters>
                                        <ListItemText primary={t('VAT')+' (' + taxFormatter.format(vat.vat) + ') : '} />
                                        <Typography>{currencyFormatter.format(vat.sum)}</Typography>
                                    </ListItem>
                                )) }
                                <ListItem disableGutters>
                                    <ListItemText primary={t('TotalPriceBrutto')+':'} />
                                    <Typography>{currencyFormatter.format(cart.totalPrice)}</Typography>
                                </ListItem>
                            </List>
                            {/* {error && <Message mb={16}>{error}</Message>} */}
                            <Button
                                variant='contained'
                                // color='secondary'
                                style={{
                                    color: COLOR_WHITE,
                                    backgroundColor:COLOR_BUTTON_PRIMARY_BACKGROUND
                                }}
                                fullWidth
                                disabled={cart.cartItems.length === 0}
                                onClick={placeOrderHandler}
                            >
                                <label style={{fontWeight: "bold"}}>{t('Checkout')}</label>
                            </Button>
                            <Button
                                variant='contained'
                                component={RouterLink}
                                to='/cart'
                                fullWidth
                                style={{ marginTop: 16 }}
                            >
                                {t('Back')}
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default CheckoutScreen;


// <BlobProvider document={<InvoicePDF cart={cart} />} >
// {({ blob, url, loading, error }) => {
//     console.log(url, loading);
//     if (url && url.length > 0) {
//         console.log(url);
//         var file_object = fetch(url) 
//         .then(r => r.blob())
//         .then(blob => {
//             var file_name = Math.random().toString(36).substring(6) + '_name.pdf'; //e.g ueq6ge1j_name.pdf
//             var file_object = new File([blob], file_name, {type: 'application/pdf'});
//             console.log('get ', file_object);
//             formData.append('invoicePDF', file_object);
//             return file_object;
//          });
//     }
//     return <></>
// }}
// </BlobProvider>