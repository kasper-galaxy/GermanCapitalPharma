import React, { useEffect } from 'react';
import queryString from 'query-string';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, createMuiTheme, FormControl, Grid, Link, makeStyles, Paper, ThemeProvider } from '@material-ui/core';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BiArrowBack } from 'react-icons/bi';
import backgroundImage from '../assets/images/background.jpg';
import logo from '../assets/images/logo.png';
import InputController from '../components/InputController';
import { COLOR_BUTTON_PRIMARY_BACKGROUND, COLOR_WHITE } from '../constants/color.constants';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../actions/user.action';
import Loader from '../components/Loader';
import { openSnackbar } from '../actions/snackbar.action';

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
        height: '50vh',
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
        padding: '24px 20%',
        height: '100%',
        [theme.breakpoints.down('xs')]: {
            padding: '24px 10%',
        },
    },
    form: {
      paddingTop: theme.spacing(1),
    },
    backIcon: {
      position: 'absolute',
      top: 5,
      left: 0,
    },
    logo: {
      width: '160px',
      marginTop: 32,
      marginBottom: 24,
    },
}));

const ForgotPasswordScreen = ({ location, history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const methods = useForm();
    const { handleSubmit } = methods;

    const { redirect = '/login' } = queryString.parse(location.search);
    const { t } = useTranslation();
    const { loading, error, IsSuccess } = useSelector((state) => state.userForgotPassword);
    
    const submitHandler = ({ email }) => {
        dispatch(forgotPassword({ email }));
    };

    useEffect(() => {
        if (IsSuccess) {
            dispatch(openSnackbar(t('PasswordResetSuccess'), 'success'));
            history.push('/');
        }
    }, [IsSuccess, history, dispatch, t]);

    useEffect(() => {
        if (error) {
            dispatch(openSnackbar(error, 'error'));
        }
    }, [error, dispatch]);

    return (
        <ThemeProvider theme={theme}>
            <Paper className={classes.root} square>
                <Grid container component={Paper} className={classes.container}>
                    <Grid item sm={12}>
                        <Box className={classes.content}>
                            <Button
                                component={RouterLink}
                                to='/login'
                                startIcon={<BiArrowBack />}
                                className={classes.backIcon} />
                            <img src={logo} alt='logo' className={classes.logo} />
                            <FormProvider {...methods}>
                                <form
                                    className={classes.form}
                                    onSubmit={handleSubmit(submitHandler)}>
                                    <FormControl fullWidth style={{ marginBottom: 8, marginTop: 8 }}>
                                        <InputController 
                                            name='email'
                                            label='Email'
                                            required
                                            rules={{
                                              pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: t('InvalidEmailAddress'),
                                              },
                                            }} />
                                    </FormControl> <br/> <br/>
                                    <Button
                                        type='submit'
                                        variant='contained'
                                        style={{
                                          color: COLOR_WHITE,
                                          backgroundColor: COLOR_BUTTON_PRIMARY_BACKGROUND,
                                          marginTop: 16
                                        }}
                                        fullWidth>
                                        {t('ResetPassword')}
                                    </Button>
                                </form>
                            </FormProvider>
                            <Box my={2} mt={4}>
                                {t('RememberPassword')}&nbsp;&nbsp;&nbsp;
                                <Link component={RouterLink} to={`/login?redirect=${redirect}`}>
                                    {t('SignIn')}
                                </Link>
                            </Box>
                            <Box my={2} mt={4}>
                                {loading && <Loader my={0} />}
                                {/* {error && <Message mt={0}>{error}</Message>} */}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </ThemeProvider>
    );
};

export default ForgotPasswordScreen;