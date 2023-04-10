import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Meta from '../components/Meta';
import { removeFromCart } from '../actions/cart.actions';
import { openSnackbar } from '../actions/snackbar.action';
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Grid,
  Hidden,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ProductFormSelect from '../components/Product/ProductFormSelect';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import DeleteIcon from '@material-ui/icons/Delete';
import { useTranslation } from 'react-i18next';
import { COLOR_BUTTON_PRIMARY_BACKGROUND, COLOR_WHITE } from '../constants/color.constants';
import { calcTaxPerVAT, currencyFormatter, taxFormatter } from '../utils';

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
  },
  largeImage: {
    width: theme.spacing(12),
    height: theme.spacing(15),
  },
  cartTotalWrapper: {
    padding: 20,
    fontSize: 16,
    backgroundColor: '#F4F4F4',
  },
  cartTotal: {
    fontSize: 18,
    marginBottom: 8,
    '&:nth-child(2)': {
      color: theme.palette.secondary.main,
    },
  },
  formControl: {
    marginRight: 24,
  },
  divider: {
    margin: '8px 0',
    width: 60,
    height: 2,
    backgroundColor: '#2a2a2a',
  },
  linkColor: {
      color: '#000'
  }
}));

const CartScreen = ({ history }) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const { t } = useTranslation();
  const { cartItems } = useSelector((state) => state.cart);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.qty * item.price, 0);
  const totalTax = cartItems
    .reduce((acc, item) => acc + item.qty * item.price * item.vat, 0);
  const totalPriceWithTax = (
        Number(totalPrice) +
        Number(totalTax)
    ).toFixed(2);

  const vats = calcTaxPerVAT(cartItems);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
    dispatch(openSnackbar(t('RemovedFromCart'), 'success'));
  };

  const checkoutHandler = () => {
    if (userInfo && userInfo.userVerified) {
      history.push('/checkout');
    } else {
      dispatch(openSnackbar(t('AccountNotApproved'), 'error'));
    }
  };

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }
  }, [userInfo, history]);

  return (
    <Container maxWidth='xl' style={{ marginBottom: 48 }}>
      <Meta title={t('Cart')} />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item>
          <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />}>
            <Link className={classes.linkColor} component={RouterLink} to='/'>
              {t('Home')}
            </Link>
            <Link color='textPrimary' component={RouterLink} to='/cart'>
              {t('Cart')}
            </Link>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          {cartItems.length > 0 ? (
            <>
              <TableContainer component={Paper} elevation={0}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('Products')}</TableCell>
                      <Hidden smDown>
                        <TableCell align='right'>{t('PriceNetto')}</TableCell>
                        <TableCell align='right'>{t('VAT')}</TableCell>
                        <TableCell align='center'>{t('Quantity')}</TableCell>
                        <TableCell align='center'>{t('Action')}</TableCell>
                      </Hidden>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell component='th' scope='item'>
                          <ListItem disableGutters>
                            <ListItemAvatar>
                              <Avatar
                                variant='square'
                                src={item.images && item.images[0].url}
                                alt={t('ProductImage')}
                                className={classes.largeImage}
                              ></Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={item.name}
                              style={{ marginLeft: 16 }}
                            />
                          </ListItem>
                          <Hidden mdUp>
                            <Divider variant='fullWidth' />
                            <Box
                              display='flex'
                              justifyContent='space-between'
                              alignItems='center'
                              mt={2}
                            >
                              <Box textAlign='center'>{currencyFormatter.format(item.price) }</Box>
                              <Box textAlign='center'>{taxFormatter.format(item.vat) }</Box>
                              <Box textAlign='center'>
                                <ProductFormSelect item={item} />
                              </Box>
                              <Box textAlign='center'>
                                <IconButton
                                  edge='end'
                                  onClick={() =>
                                    removeFromCartHandler(item.product)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Box>
                          </Hidden>
                        </TableCell>
                        <Hidden smDown>
                          <TableCell align='right'>{currencyFormatter.format(item.price)}</TableCell>
                          <TableCell align='right'>{taxFormatter.format(item.vat)}</TableCell>
                          <TableCell align='right'>
                            <ProductFormSelect item={item} />
                          </TableCell>
                          <TableCell align='right'>
                            <IconButton
                              edge='end'
                              onClick={() =>
                                removeFromCartHandler(item.product)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </Hidden>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <div className={classes.empty}>
              <Typography variant='subtitle1'>
                {t('YourCartIsEmpty')}{' '}
                <Link to='/' component={RouterLink} color='primary'>
                  {t('ShoppingNow')}
                </Link>
              </Typography>
            </div>
          )}
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper elevation={0} className={classes.cartTotalWrapper}>
            <Typography variant='h4' style={{ fontSize: 23 }}>
              {t('CartTotal')}
            </Typography>
            <Divider className={classes.divider} />
            <List style={{ padding: '10px 0 20px' }}>
              <ListItem divider disableGutters>
                <ListItemText primary={t('Items')+':'} />
                <Typography>
                  {cartItems.reduce((acc, item) => acc + parseInt(item.qty), 0)}
                </Typography>
              </ListItem>
              <ListItem divider disableGutters>
                <ListItemText primary={t('PriceNetto')+':'} />
                <Typography >{currencyFormatter.format(totalPrice)}</Typography>
              </ListItem>
              { vats.map(vat => (
                  <ListItem key={vat.vat} divider disableGutters>
                      <ListItemText primary={t('VAT')+' (' + taxFormatter.format(vat.vat) + ') : '} />
                      <Typography>{currencyFormatter.format(vat.sum)}</Typography>
                  </ListItem>
              )) }
              <ListItem divider disableGutters>
                <ListItemText primary={t('TotalPriceBrutto')+':'} />
                <Typography >{currencyFormatter.format(totalPriceWithTax)}</Typography>
              </ListItem>
            </List>
            {cartItems.length > 0 && <Button
              variant='contained'
                    // color='secondary'
                    style={{
                      color: COLOR_WHITE,
                      backgroundColor: COLOR_BUTTON_PRIMARY_BACKGROUND,
                      marginTop: 8
                    }}
              fullWidth
              onClick={checkoutHandler}
            >
              <label style={{fontWeight: "bold"}}>{t('ProceedToCheckout')}</label>
              
            </Button> }
            
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartScreen;
