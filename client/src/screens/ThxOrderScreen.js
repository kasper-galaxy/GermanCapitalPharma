import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, createMuiTheme, Grid, makeStyles, Paper, ThemeProvider, Typography } from '@material-ui/core';
import { BiArrowBack } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import logo from '../assets/images/logo.png';
import backgroundImage from '../assets/images/background.jpg';

const theme = createMuiTheme({
    typography: {
      fontFamily: ['PF Din Text Universal Light'].join(','),
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
      ...theme.mixins.customize.centerFlex(),
      height: '100vh',
      backgroundImage: `url(${backgroundImage})`,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      fontFamily: 'PF Din Text Universal Light',
    },
    container: {
      height: '85vh',
      width: '35%',
      backgroundColor: theme.palette.background.paper,
      overflow: 'hidden',
      boxShadow: '0px 0px 25px -18px rgba(0,0,0,0.75)',
      [theme.breakpoints.down('lg')]: {
          width: '60%',
      },
      [theme.breakpoints.down('xs')]: {
        width: '90%',
      },
    },
    image: {
      objectFit: 'cover',
      height: '100%',
      width: '100%',
      backgroundColor: 'rgb(227, 65, 85, 0.08)',
    },
    content: {
      position: 'relative',
      ...theme.mixins.customize.flexMixin('center', 'center', 'column'),
      padding: '24px 15%',
      height: '100%',
      [theme.breakpoints.down('xs')]: {
        padding: '24px 10%',
      },
    },
    form: {
      paddingTop: theme.spacing(6),
    },
    backIcon: {
      position: 'absolute',
      top: 5,
      left: 0,
    },
    logo: {
      width: '160px',
      marginTop: 8,
      marginBottom: 64,
    },
}));

const ThxOrderScreen = ({ location, history }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const paths = location.pathname.split('/');
    const orderId = paths.pop();
    console.log(paths, orderId);

    if (!orderId) {
        console.log('no order');
        history.push('/');
    } else {
      console.log('order');
        setTimeout(() => {
            history.push('/shop');
        }, 20000);
    }

    return (
        <ThemeProvider theme={theme}>
            <Paper className={classes.root} square>
                <Grid container component={Paper} className={classes.container}>
                    <Grid item sm={12}>
                        <Box className={classes.content}>
                            <Button
                                component={RouterLink}
                                to='/'
                                startIcon={<BiArrowBack />}
                                className={classes.backIcon} />
                            <img src={logo} alt='' className={classes.logo} />
                            <Box>
                                <Typography variant="h6" color="inherit" style={{display: 'inline-block', fontWeight: 'bold'}}>
                                  {t('ThanksOrderTitle')}
                                </Typography><br /><br />
                                <Typography variant="subtitle1" color="inherit" style={{display: 'inline-block', fontWeight: 'bold'}}>
                                    {t('ThanksOrderID') + orderId}
                                </Typography><br /><br />
                                <Typography variant="subtitle1" color="inherit">
                                    {t('ThanksOrderBody1')}
                                </Typography>
                                <Typography variant="subtitle1" color="inherit">
                                    {t('ThanksOrderBody2')}
                                </Typography>
                                <Typography variant="subtitle1" color="inherit">
                                    {t('ThanksOrderBody3')}
                                </Typography><br />
                                <Typography variant="subtitle1" color="inherit">
                                    {t('ThanksOrderBody4')}
                                </Typography>
                                <Typography variant="subtitle1" color="inherit">
                                    {t('ThanksOrderTeam')}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </ThemeProvider>
    );
};

export default ThxOrderScreen;