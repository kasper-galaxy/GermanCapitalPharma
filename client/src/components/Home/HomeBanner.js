import { Button, createMuiTheme, Grid, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { COLOR_BUTTON_PRIMARY_BACKGROUND } from '../../constants/color.constants';
import bannerImage1 from '../../assets/images/banner_1.jpg';
import bannerImage2 from '../../assets/images/banner_2.jpg';

const theme = createMuiTheme({
    breakpoints: {
        values: { xs: 0, sm: 760, md: 960, lg: 1200, xl: 1400 },
    }
});

const HomeBanner = () => {
    const { t } = useTranslation();

    return (
        <div className='banner'>
            <ThemeProvider theme={theme}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                        <div className='banner__inner banner__inner--left'>
                            <img
                                src={bannerImage1}
                                alt='banner img'
                                className='banner__image'></img>
                            <div className='banner__content'>
                                <div className='content__wrapper'>
                                    <div className='content__subtitle'>{t('PharmacyStore')}</div>
                                    <h2 className='content__title'>
                                        New Eye capsules
                                    </h2>
                                    <div className='content__sale'>{t('UPTO70OFF')}</div>
                                    <Button
                                        variant='outlined'
                                        style={{
                                            color: COLOR_BUTTON_PRIMARY_BACKGROUND,
                                        }}
                                        className='content__button'
                                        component={Link}
                                        to='/shop'>
                                        {t('ShopNow')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <div className='banner__inner banner__inner--right'>
                            <img
                                src={bannerImage2}
                                alt='banner img'
                                className='banner__image'>
                            </img>
                            <div className='banner__content'>
                                <div className='content__wrapper'>
                                <span className='content__subtitle'>{t('PharmacyStore')}</span>
                                    <h2 className='content__title'>
                                        Neue Augentabletten
                                    </h2>
                                    <span className='content__sale'>{t('UPTO70OFF')}</span>
                                    <Button
                                        variant='outlined'
                                        style={{
                                            color: COLOR_BUTTON_PRIMARY_BACKGROUND,
                                        }}
                                        className='content__button'
                                        component={Link}
                                        to='/shop'>
                                        {t('ShopNow')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </div>
    );
};

export default HomeBanner;