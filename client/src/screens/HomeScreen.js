import { Container, Grid } from '@material-ui/core';
import React from 'react';
import HomeBanner from '../components/Home/HomeBanner';
import HomeCarousel from '../components/Home/HomeCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {
    return (
        <>
            <Meta />
            <HomeCarousel />
            <Container maxWidth='xl'>
                <Grid container spacing={3}>
                    <Grid
                        item
                        xs={12}
                        style={{
                            display: 'flex',
                            flexBasis: '100%',
                            justifyContent: 'center',
                        }}>

                    </Grid>
                </Grid>
                <HomeBanner />
            </Container>
        </>
    );
};

export default HomeScreen;