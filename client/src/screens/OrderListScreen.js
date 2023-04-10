import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders } from '../actions/order.actions';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Breadcrumbs,
  Link,
  TableCell,
  TableRow,
  TableHead,
  Table,
  TableContainer,
  TableBody,
  IconButton,
  Collapse,
  Box,
  TablePagination,
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import { BiCommentDetail } from 'react-icons/bi';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Meta from '../components/Meta';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { COLOR_BUTTON_PRIMARY_BACKGROUND, COLOR_WHITE } from '../constants/color.constants';
import { currencyFormatter, formatDate, taxFormatter } from '../utils';
import { openSnackbar } from '../actions/snackbar.action';

const useStyles = makeStyles((theme) => ({
  button: {
    padding: '6px 0',
    minWidth: '50px',
    '& .MuiButton-startIcon': {
      margin: 0,
    },
  },
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
    '& .MuiBreadcrumbs-ol': {
      justifyContent: 'flex-start',
    },
  },
  dataGrid: {
    boxShadow: '0 10px 31px 0 rgba(0,0,0,0.05)',
  },
  linkColor: {
      color: '#000'
  }
}));

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function Row(props) {
  const { row, history } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const handleRebuy = () => {
    dispatch(openSnackbar(t('PriceChanged'), 'warning'));
    var local_rebuy_cart = {
      cartItems: row.orderItems
    };
    localStorage.setItem('rebuy', JSON.stringify(local_rebuy_cart));
    console.log('retrieve orders : ', local_rebuy_cart);
    history.push('/checkout');
  }

  return (
    <React.Fragment>
      <TableRow hover className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="medium" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell>{formatDate(row.createdAt, i18n.resolvedLanguage === 'de' ? '.' : '-')}</TableCell>
        <TableCell>{currencyFormatter.format(row.totalPrice - row.taxPrice)}</TableCell>
        <TableCell>{currencyFormatter.format(row.taxPrice)}</TableCell>
        <TableCell>{currencyFormatter.format(row.totalPrice)}</TableCell>
        <TableCell>{t('Order_'+row.status)}</TableCell>
        <TableCell>
          <Button 
            variant='contained'
            style={{
                backgroundColor: COLOR_WHITE,
                color: COLOR_BUTTON_PRIMARY_BACKGROUND
            }}
            startIcon={<VisibilityIcon />}
            href={row.invoiceID && row.invoiceID.url}
            target='_blank'>
            {t('Open')}
          </Button>
        </TableCell>
        <TableCell>
          <Button 
            variant='contained'
            style={{
                backgroundColor: COLOR_WHITE,
                color: COLOR_BUTTON_PRIMARY_BACKGROUND
            }}
            startIcon={<ShoppingCartIcon />}
            onClick={handleRebuy}
            target='_blank'>
            {t('OrderListHeaderRebuy')}
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                {t('OrderItems')}
              </Typography>
              <Table size="medium" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('OrderListHeaderProduct')}</TableCell>
                    <TableCell>{t('OrderListHeaderNetPrice')}</TableCell>
                    <TableCell align="right">{t('OrderListHeaderVAT')}</TableCell>
                    <TableCell align="right">{t('OrderListHeaderQty')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.orderItems.map((orderItem) => (
                    <TableRow key={orderItem.name}>
                      <TableCell component="th" scope="row">
                        {orderItem.name}
                      </TableCell>
                      <TableCell>{currencyFormatter.format(orderItem.price)}</TableCell>
                      <TableCell align="right">{taxFormatter.format(orderItem.vat)}</TableCell>
                      <TableCell align="right">
                        {orderItem.qty}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const OrderListScreen = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const orderList = useSelector((state) => state.orderList);
  let { loading, error, orders = [] } = orderList;
  // orders = orders.map((order) => ({ ...order, id: order._id }));

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (userInfo) {
        dispatch(listOrders());
    } else {
        history.push('/login');
    }
  }, [dispatch, history, userInfo]);

  useEffect(() => {
    if (orders.length > 0) {
      console.log('retrieve orders : ', orders);
    }
  }, [orders]);

  return (
    <Container maxWidth='xl' style={{ marginBottom: 48 }}>
    <Meta title={t('OrderList') + ' | ' + t('PharmacyStore')} />
    <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize='small' />}
                style={{ marginBottom: 24 }}>
                  
                <Link className={classes.linkColor} component={RouterLink} to='/'>
                    {t('Home')}
                </Link>
                <Link color='textPrimary' component={RouterLink} to='/order-list'>
                    {t('OrderList')}
                </Link>
            </Breadcrumbs>
        </Grid>
    </Grid>
      {loading ? (
        <Loader></Loader>
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <Paper className={classes.root}>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>{t('OrderListHeaderID')}</TableCell>
                  <TableCell>{t('OrderListHeaderDate')}</TableCell>
                  <TableCell>{t('OrderListHeaderSumPrice')}</TableCell>
                  <TableCell>{t('OrderListHeaderTax')}</TableCell>
                  <TableCell>{t('OrderListHeaderTotalPrice')}</TableCell>
                  <TableCell>{t('OrderListHeaderStatus')}</TableCell>
                  <TableCell>{t('OrderListHeaderInvoice')}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                  <Row key={order.id} row={order} history={history} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            labelRowsPerPage={i18n.resolvedLanguage === 'de' ? `Anzahl pro Seite` : `Rows per page`}
          />
        </Paper>
      )}
    </Container>
  );
};

export default OrderListScreen;
