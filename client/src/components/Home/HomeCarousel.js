import React from 'react';
import { Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useTranslation } from 'react-i18next';
import { Carousel } from 'react-responsive-carousel';
import carouselImage from '../../assets/images/carousel.jpg';

const dataCarousel = [
    {
        image: carouselImage,
        subtitle: "SUMMER '21",
        title: '50% Rabatt',
        position: 'left',
    },
    {
        image: carouselImage,
        subtitle: "50% OFF",
        title: 'Sommerangebot',
        position: 'right',
    },
];

const HomeCarousel = () => {
    const { t } = useTranslation();
    return (
        <div>
            <Carousel
                autoPlay
                interval={5000}
                infiniteLoop
                showIndicators
                showArrows
                swipeable={false}
                showThumbs={false}
                showStatus={false}
                animationHandler='fade'>
                {dataCarousel.map((slide, index) => (
                    <div className='carousel__slide' key={index}>
                        <img src={slide.image} alt='' className='carousel__img' />
                        <div className={`carousel__banner carousel__banner--${slide.position}`}>
                            <div className='banner__subtitle'>{slide.subtitle}</div>
                            <h2 className='banner__title'>{slide.title}</h2>
                            <Button
                                to='/signup/profile'
                                component={RouterLink}
                                size='large'
                                variant='outlined'
                                style={{
                                    backgroundColor:'#D30808',
                                    color:'#FFFFFF'
                                }}
                                className='banner__link'>
                                {t('SignUp')}
                            </Button>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default HomeCarousel;