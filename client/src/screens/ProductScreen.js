import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Breadcrumbs, Button, Container, Divider, FormControl, FormLabel, Grid, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Link, Chip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Link as RouterLink } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { useDispatch, useSelector } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { FiShoppingBag } from 'react-icons/fi';
import { useForm, Controller } from 'react-hook-form';
import { fetchProductDetails } from '../actions/product.action';
import { addToCart } from '../actions/cart.actions';
import { currencyFormatter, taxFormatter } from '../utils';
import { openSnackbar } from '../actions/snackbar.action';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { COLOR_BUTTON_PRIMARY_BACKGROUND, COLOR_WHITE } from '../constants/color.constants';

const useStyles = makeStyles((theme) => ({
    breadcrumbsContainer: {
      ...theme.mixins.customize.breadcrumbs,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    productInfo: {
      [theme.breakpoints.down('sm')]: {
        paddingTop: '0 !important',
      },
    },
    price: {
      fontSize: '1.6rem',
      fontWeight: 600,
      fontStyle: "bold",
      color: (props) => props.sale > 0 && '#929292',
    },
    rootPrice: {
      fontSize: '1.3rem',
      textDecoration: 'line-through',
    },
    description: {
      whiteSpace: 'pre-wrap',
      fontSize: 16,
      color: theme.palette.grey[700],
    },
    label: {
      fontSize: 18,
      color: '#2a2a2a',
    },
    button: {
      marginTop: 30,
      height: 48,
      width: 250,
      marginRight: 15,
    },
    linkColor: {
        color: '#000'
    }
  }));

const ProductScreen = ({ history, match }) => {
    const { t } = useTranslation();
    const { handleSubmit, control } = useForm();
    const dispatch = useDispatch();

    const [cols, setCols] = useState([]);
    const [datas, setDatas] = useState([]);

    // Local State Data
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    const classes = useStyles(product);

    // Handlers
    useEffect(() => {
        dispatch(fetchProductDetails(match.params.id));
      }, [dispatch, match.params.id]);
    
    useEffect(() => {
        console.log('product', product);
        if (product && product.ingredients) {
            console.log('product ', product.ingredients);
            const { columns, data } = product.ingredients;
            let cols_tmp = [...columns];
            cols_tmp.pop();
            setCols(cols_tmp);
            setDatas(data);
        }
    }, [product]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    }, [match.params.id]);

    const checkKeyDown = (e) => {
        // if (e. keyCode === 13) return false;
        if (e.code === 'Enter') e.preventDefault();
      };
      
    const addToCartHandler = ({ qty }, e) => {
        e.preventDefault();
        console.log(e);
        if (userInfo && userInfo.userVerified) {
          dispatch(addToCart(match.params.id, qty));
          dispatch(
            openSnackbar(t('AddedToCart'), 'success', {
              hasLink: true,
              to: '/cart',
              text: t('ViewShoppingCart'),
            })
          );
        }
    };

    return (
        <>
        <Container maxWidth='xl' className={classes.wrapper}>
            { loading ? (
                <Loader my={200} />
            ) : error ? (
                <Message mt={100}>
                    {error}
                </Message>
            ) : (
                <>
                    <Meta title={product.name} />
                    <Grid container className={classes.breadcrumbsContainer}>
                        <Grid item>
                            <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />}>
                                <Link className={classes.linkColor} component={RouterLink} to='/'>
                                    {t('Home')}
                                </Link>
                                <Link className={classes.linkColor} component={RouterLink} to='/shop'>
                                    {t('Shop')}
                                </Link>
                                <Link
                                    color='textPrimary'
                                    component={RouterLink}
                                    to={`/product/${product.id}`}
                                >
                                    {product?.name || t('NotFoundProduct')}
                                </Link>
                            </Breadcrumbs>
                        </Grid>
                    </Grid>
                    <Grid container spacing={8}>
                        <Grid item xs={12} md={5}>
                            <Carousel
                                showIndicators
                                showArrows
                                showThumbs
                                swipeable={false}
                                showStatus={false}
                                animationHandler='fade'
                                className='product-screen-carousel'>
                                {product.images?.map((image, i) => (
                                    <div className='slide-product-image' key={i}>
                                        <img src={image.url} alt='' />
                                    </div>
                                ))}
                            </Carousel>
                        </Grid>
                        <Grid item xs={12} md={7} className={classes.productInfo}>
                            <Typography variant='h4' component='h1' gutterBottom>
                                {product.name}
                            </Typography>
                            { userInfo && userInfo.userVerified && 
                                <>
                                    <Typography
                                        variant='h6'
                                        color='textPrimary'
                                        component='div'
                                        className={classes.price}
                                        gutterBottom>
                                        {currencyFormatter.format(product.price)}
                                    </Typography>
                                </> }
                            <Typography
                                variant='body1'
                                component={'div'}
                                className={classes.description}
                            >
                                <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
                            </Typography> <br />
                            <form onSubmit={handleSubmit(addToCartHandler)} onKeyDown={(e) => checkKeyDown(e)}>
                                <FormControl variant='outlined' style={{ width: 250 }}>
                                    <FormLabel
                                        className={classes.label}
                                        style={{ marginBottom: 16 }}
                                    >
                                        {t('Quantity')}
                                    </FormLabel>
                                    <Controller
                                        name='qty'
                                        control={control}
                                        defaultValue={1}
                                        // helperText={!product.countInStock && t('OutStock')}
                                        render={({ field }) => (
                                        <TextField
                                            required
                                            {...field}
                                            label={t('SelectQuantity')}
                                            variant="outlined"
                                            InputProps={{
                                                readOnly: userInfo && userInfo.userVerified ? false : true,
                                            }}
                                            onInput = {(e) =>{
                                                e.target.value = e.target.value.length > 0 ? Math.max(0, parseInt(e.target.value.replace(/[^0-9]/g, '')) ).toString().slice(0,5) : ''
                                                if (e.target.value === 'NaN') {
                                                    e.target.value = ''
                                                }
                                            }}/>
                                        )}
                                    />
                                </FormControl>
                                <Typography 
                                    variant='body1'
                                    component='p'
                                    style={{
                                        marginTop: 30
                                    }}
                                    className={classes.description}>{product.itemNumber}</Typography>
                                <Divider style={{ marginTop: 30 }} />
                                {userInfo && userInfo.userVerified && 
                                    <Button
                                        variant='contained'
                                        type='submit'
                                        style={{
                                            color: COLOR_WHITE,
                                            backgroundColor:COLOR_BUTTON_PRIMARY_BACKGROUND,
                                            marginBottom: 30
                                        }}
                                        startIcon={<FiShoppingBag />}
                                        className={classes.button}>
                                        {t('AddToCart')}
                                    </Button>}
                            </form>
                            
                                {!userInfo && 
                                    <Button
                                    variant='contained'
                                    // color='secondary'
                                    style={{
                                        color: COLOR_WHITE,
                                        backgroundColor:COLOR_BUTTON_PRIMARY_BACKGROUND,
                                        marginBottom: 30
                                    }}
                                    onClick={() => {
                                        history.push('/login');
                                    }}
                                    className={classes.button}>
                                    {t('LoginNow')}
                                    </Button>
                                }
                            <Divider />
                            <Box style={{width: '100%'}} my={2}>
                                <Accordion>
                                    <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    >
                                    <Typography className={classes.heading}>{t('ProductDescription')}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                    <Typography
                                        variant='body1'
                                        component={'div'}
                                        className={classes.description}>
                                        <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
                                    </Typography>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel2a-content"
                                        id="panel2a-header"
                                    >
                                    <Typography className={classes.heading}>{t('ProductIngredients')}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                    <TableContainer>
                                    <Table style={{width: "100%"}} aria-label="a dense table">
                                        <TableHead>
                                        <TableRow>
                                            {cols.map((col) => (<TableCell align="left" style={{ width: '15%' }} key={col.label}>{col.label}</TableCell>))}
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {datas.map((row) => (
                                                <TableRow
                                                    key={row[cols[0].id]}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    {cols.map((col) => (<TableCell align="left" key={row[col.id]}>{row[col.id]}</TableCell>))}
                                                    {/* <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>*/}
                                                </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                    </TableContainer>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3a-content"
                                    id="panel3a-header"
                                    >
                                    <Typography className={classes.heading}>{t('ProductConsumption')}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                    <Typography
                                        variant='body1'
                                        component={'div'}
                                        className={classes.description}>
                                        <div dangerouslySetInnerHTML={{ __html: product.consumption }}></div>
                                    </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        </Grid>
                    </Grid>
                </>
            ) }
            
        </Container>
        </>
    );
};

export default ProductScreen;