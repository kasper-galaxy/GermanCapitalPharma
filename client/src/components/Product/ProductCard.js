import React, { useState } from 'react';
import { Button, Card, CardActionArea, CardContent, CardMedia, Hidden, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { COLOR_BUTTON_PRIMARY_BACKGROUND, COLOR_PRODUCT_CARD_GROUP_HOVER, COLOR_WHITE } from '../../constants/color.constants';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';

import { RiShoppingBag3Fill } from 'react-icons/ri';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import AddShoppingCartOutlinedIcon from '@material-ui/icons/AddShoppingCartOutlined';

import { currencyFormatter } from '../../utils';
import ProductModalView from './ProductModalView';
import { addToCart, setOpenCartDrawer } from '../../actions/cart.actions';

const useStyles = makeStyles((theme) => ({
    root: {
      boxShadow: `0px 0px 0px 0px rgb(0 0 0 / 0%), 
                  0px 1px 1px 0px rgb(0 0 0 / 0%), 
                  0px 1px 0px 1px rgb(0 0 0 / 4%)`,
      '&:hover $mediaFront': {
        opacity: 0,
      },
      '&:hover $groupAction': {
        transform: 'translate(0, -50%)',
      },
    },
    mediaWrapper: {
      position: 'relative',
      paddingTop: '133.33333%', // 3:4 aspect ratio (4/3=133.33)
    },
    media: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundSize: 'cover',
      backgroundColor: COLOR_WHITE,
      width: '100%',
    },
    mediaFront: {
      transition: 'opacity .4s',
    },
    groupAction: {
      position: 'absolute',
      top: 65,
      right: 10,
      transform: 'translate(120%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'transparent',
      transition: 'all .3s ease-in-out',
      zIndex: 1,
      '& a + a': {
        paddingTop: '10px',
      },
      '& svg': {
        color: '#999',
      },
      '& button:hover svg': {
        color: COLOR_PRODUCT_CARD_GROUP_HOVER,
      },
      '& .MuiIconButton-root': {
        backgroundColor: 'rgba(255,255,255,0.5)',
        margin: '4px 0',
      },
    },
    mediaMobile: {
        ...theme.mixins.customize.flexMixin(
          'space-between',
          'center',
          'row',
          'wrap'
        ),
        '@media (max-width: 740px)': {
          flexWrap: 'wrap',
          '& > button': {
            backgroundColor: 'rgba(245, 0, 87, 0.05) !important',
            flexBasis: '100%',
            marginTop: 10,
          },
        },
      },
      price: {
        fontSize: '1rem',
        fontWeight: 600,
        // color: (props) => props.sale > 0 && config.SolidColor,
      },
      rootPrice: {
        textDecoration: 'line-through',
      },
}));

const ProductCard = (props) => {
    const { t } = useTranslation();
    const { id, name, images, price } = props;
    const [ openModal, setOpenModal ] = useState(false);
    const classes = useStyles(props);
    const dispatch = useDispatch();

    // Local State Data
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    // Handlers
    const handleAddToCart = (e, id) => {
        e.preventDefault();
        dispatch(setOpenCartDrawer(true));
        dispatch(addToCart(id, 1, 'm'));
    };

    const handleOpenQuickView = (e) => {
        e.preventDefault();
        setOpenModal(true);
    };

    return (
        <>
            <Card className={classes.root}>
                <CardActionArea component={RouterLink} to={`/product/${id}`}>
                    <div className={classes.mediaWrapper}>
                        <Hidden smDown>
                            <div className={classes.groupAction}>
                                <Tooltip title={t('QuickViews')} placement='right-start' arrow>
                                    <IconButton onClick={handleOpenQuickView}>
                                        <VisibilityOutlinedIcon />
                                    </IconButton>
                                </Tooltip>
                                { userInfo && userInfo.userVerified && 
                                    <Tooltip title={t('AddToCart')} placement='right' arrow>
                                        <IconButton onClick={(e) => handleAddToCart(e, id)}>
                                            <AddShoppingCartOutlinedIcon />
                                        </IconButton>
                                    </Tooltip>
                                }
                            </div>
                        </Hidden>

                        <CardMedia 
                            className={classes.media}
                            component='img'
                            src={ images && images.length > 1 ? images[1].url : images[0].url }/>
                        <CardMedia 
                            className={clsx(classes.media, classes.mediaFront)}
                            component='img'
                            src={images && images[0].url}/>
                    </div>
                    <CardContent component={'div'} style={{ paddingBottom: 10 }}>
                        <Tooltip title={name || ''}>
                            <Typography
                                gutterBottom
                                variant='subtitle1'
                                component='div'
                                noWrap>
                                {name}
                            </Typography>
                        </Tooltip>

                        { userInfo && userInfo.userVerified && 
                          <div className={classes.mediaMobile}>
                            <Typography
                              variant='subtitle2'
                              color='textPrimary'
                              component='div'
                              className={classes.price}
                              noWrap>
                              { currencyFormatter.format(price) }
                            </Typography>
                            <Hidden mdUp>
                                <Tooltip title={t('AddToCart')} placement='bottom' arrow>
                                    <Button
                                        onClick={(e) => handleAddToCart(e, id)}
                                        style={{
                                            color: COLOR_WHITE,
                                            backgroundColor: COLOR_BUTTON_PRIMARY_BACKGROUND,
                                            whiteSpace: 'nowrap'
                                        }}
                                        className={classes.cartMobile}
                                        startIcon={<RiShoppingBag3Fill />}>
                                        {t('AddToCart')}
                                    </Button>
                                </Tooltip>
                            </Hidden>
                          </div>
                        }
                    </CardContent>
                </CardActionArea>
            </Card>
            <ProductModalView 
              {...props}
              openModal={openModal}
              setOpenModal={setOpenModal}
            />
        </>
    );
};

export default ProductCard;