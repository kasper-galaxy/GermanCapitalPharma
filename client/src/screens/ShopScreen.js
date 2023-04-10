import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs, Container, Grid, makeStyles, Link, FormControl, FormLabel, Select, MenuItem, Box, Chip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import queryString from 'query-string';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { PaginationItem, Pagination } from '@material-ui/lab';
import { RiLayoutGridFill, RiLayoutFill } from 'react-icons/ri';
import { openSnackbar } from '../actions/snackbar.action';
import { filterClearAll, removeSearchTerm } from '../actions/filter.action';
import { listShopProduct } from '../actions/product.action';
import { COLOR_BUTTON_PRIMARY_BACKGROUND, COLOR_WHITE } from '../constants/color.constants';
import Meta from '../components/Meta';
import Message from '../components/Message';
import Loader from '../components/Loader';
import ProductCard from '../components/Product/ProductCard';

const useStyles = makeStyles((theme) => ({
    breadcrumbsContainer: {
        ...theme.mixins.customize.breadcrumbs,
        paddingBottom: 0,
        marginBottom: 20,
        '& .MuiBreadcrumbs-ol': {
            justifyContent: 'flex-start',
        },
    },
    container: {
        marginBottom: 64,
        boxShadow: '0 10px 31px 0 rgba(0,0,0,0.05)',
    },
    selectBox: {
        flexDirection: 'row',
        alignItems: 'center',
        '& label': {
            color: '#2a2a2a',
            paddingRight: 12,
        },
        '& .MuiOutlinedInput-input': {
            paddingTop: 6,
            paddingBottom: 6,
            color: 'rgba(0, 0, 0, 0.54) ',
            fontSize: 15,
        },
        '& .MuiInputBase-formControl': {
            borderRadius: 4,
            marginRight: theme.spacing(6),
        },
    },
    layoutIcon: {
        ...theme.mixins.customize.centerFlex('column'),
        padding: 4,
        cursor: 'pointer',
        '& + $layoutIcon': {
            marginLeft: 8,
        },
    },
    topFilter: {
        ...theme.mixins.customize.flexMixin(
            'space-between',
            'center',
            'row',
            'wrap'
        ),
        boxShadow:
        'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
        padding: 22,
        marginBottom: theme.spacing(5),
        '& .MuiChip-root': {
            margin: 4,
        },
    },
    paginationWithLayout: {
        ...theme.mixins.customize.flexMixin(
            'flex-end',
            'center',
            'row',
        ),
    },
    activeLayout: {
        backgroundColor: COLOR_BUTTON_PRIMARY_BACKGROUND,
        color: COLOR_WHITE,
    },
    pagination: {
        flexBasis: '100%',
        marginRight:32,
        '& .MuiPagination-ul': {
            justifyContent: 'flex-end',
        },
    },
    linkColor: {
        color: '#000'
    }
}));

const ShopScreen = ({ location, history }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const ref = useRef();
    const dispatch = useDispatch();

    const [activeLayout, setActiveLayout] = useState('moreCol');
    const [itemsPerPage, setItemsPerPage] = useState(8);

    // Local State Data
    const query = queryString.parse(location.search);
    let { sort_by ='default', page: pageNumber = 1 } = query;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const productShop = useSelector((state) => state.productShop);
    const { loading, error, products, page, pages } = productShop;
    
    const filter = useSelector((state) => state.filter);
    const { searchTerm, priceMax, priceMin } = filter;

    // Handlers
    const handleChangeLayout = (type) => {
        setActiveLayout(type);
    };

    const items_per_page_select_handler = (evt) => {
        setItemsPerPage(evt.target.value);
    };

    useEffect(() => {
        if (userInfo) {
          if (!userInfo.userVerified) {
              dispatch(openSnackbar(t('AccountNotVerified'), 'error'));
          }
        }
      }, [dispatch, userInfo, history, t]);

      useEffect(() => {
        dispatch(listShopProduct(sort_by, itemsPerPage, pageNumber, searchTerm));
      }, [dispatch, itemsPerPage, sort_by, pageNumber, searchTerm]);

    return (
        <Container style={{ marginBottom: 140, maxWidth: '100%' }}>
            <Meta title={t('Shop')} />
            <Grid container className={classes.breadcrumbsContainer} ref={ref}>
                <Grid item xs={12}>
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize='small' />}
                        style={{ marginBottom: 24 }}>
                        <Link className={classes.linkColor} component={RouterLink} to='/'>
                            {t('Home')}
                        </Link>
                        <Link color='textPrimary' component={RouterLink} to='/shop'>
                            {t('Shop')}
                        </Link>
                    </Breadcrumbs>
                </Grid>
            </Grid>
            <Grid container spacing={4} style={{ backgroundColor: COLOR_WHITE }}>
                <Grid item xs={12}>
                    <Box className={classes.topFilter}>
                        <div>
                            <FormControl variant='outlined' className={classes.selectBox}>
                                <FormLabel>{t('SortBy')}</FormLabel>
                                <Select defaultValue={'default'}>
                                    <MenuItem value='default'>{t('DefaultSorting')}</MenuItem>
                                    <MenuItem value='latest'>{t('Latest')}</MenuItem>
                                    {/* <MenuItem value='rating'>{t('Rating')}</MenuItem> */}
                                    {/* <MenuItem value='sale'>{t('Sale')}</MenuItem> */}
                                    <MenuItem value='priceAsc'>{t('PriceAsc')}</MenuItem>
                                    <MenuItem value='priceDesc'>{t('PriceDesc')}</MenuItem>
                                </Select>
                            </FormControl>

                            
                            <FormControl variant='outlined' className={classes.selectBox}>
                                <FormLabel>{t('ItemsPerPage')}</FormLabel>
                                <Select defaultValue={'8'} onChange={items_per_page_select_handler} >
                                    <MenuItem value='8'>8</MenuItem>
                                    <MenuItem value='12'>12</MenuItem>
                                    <MenuItem value='16'>16</MenuItem>
                                    <MenuItem value='20'>20</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <Box className={classes.paginationWithLayout}>
                            {pages > 1 && (
                                <Pagination
                                    className={classes.pagination}
                                    page={page}
                                    count={pages}
                                    renderItem={(item) => (
                                    <PaginationItem
                                        component={RouterLink}
                                        to={`/shop${
                                            item.page === 0
                                            ? ''
                                            : `?sort_by=${sort_by}&page=${item.page}`
                                        }`}
                                        {...item}
                                    />
                                )}
                                />
                            )}
                            <div style={{ display: 'flex' }}>
                                <span
                                    className={clsx(
                                        classes.layoutIcon,
                                        activeLayout === 'fewCol' && classes.activeLayout
                                    )}
                                    onClick={() => handleChangeLayout('fewCol')}>
                                    <RiLayoutFill fontSize={16} />
                                </span>
                                <span
                                    className={clsx(
                                        classes.layoutIcon,
                                        activeLayout === 'moreCol' && classes.activeLayout
                                    )}
                                    onClick={() => handleChangeLayout('moreCol')}>
                                    <RiLayoutGridFill fontSize={16} />
                                </span>
                            </div>
                        </Box>
                        

                        <Box mt={2} style={{ flexBasis: '100%' }}>
                            {searchTerm && (
                            <Chip
                                variant='outlined'
                                size='small'
                                label={`Keyword: ${searchTerm}`}
                                onDelete={() => dispatch(removeSearchTerm())}
                            />
                            )}
                        </Box>
                    </Box>
                    <Grid container>
                        { loading ? (<Loader />) : error ? (<Message>{error}</Message>) : (
                            <Grid container spacing={4}>
                                {products && products.length !== 0 ? (
                                    products.map((product) => (
                                    <Grid
                                        item
                                        xs={activeLayout === 'fewCol' ? 12 : 6}
                                        sm={activeLayout === 'fewCol' ? 6 : 4}
                                        lg={activeLayout === 'fewCol' ? 4 : 3}
                                        key={product.id}
                                    >
                                        <ProductCard {...product} />
                                    </Grid>
                                    ))
                                ) : (
                                    <Grid item xs={12}>
                                        <Box display={'flex'} justifyContent='center'>
                                            <Message severity='info' mt={0}>
                                                {t('NoProductFound')+ ' '}
                                                <Link
                                                    component={RouterLink}
                                                    to={`shop?sort_by=${sort_by}&page=1`}
                                                >
                                                    {t('Back')}
                                                </Link>
                                                {` or `}
                                                <Link onClick={() => dispatch(filterClearAll())}>
                                                    {t('ClearAllFilter')}
                                                </Link>
                                            </Message>
                                        </Box>
                                    </Grid>
                                )}
                                
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ShopScreen;