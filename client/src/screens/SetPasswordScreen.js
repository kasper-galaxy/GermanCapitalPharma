import React, { useEffect, useState } from 'react';
import { Box, Button, createMuiTheme, FormControl, Grid, IconButton, InputAdornment, makeStyles, Paper, ThemeProvider, Typography } from '@material-ui/core';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BiArrowBack } from 'react-icons/bi';
import { VscEyeClosed, VscEye } from 'react-icons/vsc';
import logo from '../assets/images/logo.png';
import backgroundImage from '../assets/images/background.jpg';
import InputController from '../components/InputController';
import { COLOR_BUTTON_PRIMARY_BACKGROUND, COLOR_WHITE } from '../constants/color.constants';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setPassword } from '../actions/user.action';
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
        height: '85vh',
        width: '35%',
        backgroundColor: theme.palette.background.paper,
        overflow: 'hidden',
        boxShadow: '0px 0px 25px -18px rgba(0,0,0,0.75)',
        [theme.breakpoints.down('lg')]: {
            width: '60%',
        },
        [theme.breakpoints.down('sm')]: {
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
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
}));

const SetPasswordScreen = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const methods = useForm();
    const { handleSubmit, getValues } = methods;
    const { t } = useTranslation();
    const { token } = useParams();
    const { loading, error, IsSuccess } = useSelector((state) => state.userSetPassword);

    const onSubmit = ({ password }) => {
        if (token) {
            let _token = token.toString();
            _token = _token.slice(6);
            dispatch(setPassword({ password, token: _token }));
        }
    };

    useEffect(() => {
        if (IsSuccess) {
            dispatch(openSnackbar(t('PasswordSetSuccess'), 'success'));
            logout();
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
                                className={classes.backIcon}
                            />
                            <Typography variant='h6' component='h2' style={{color:'#12d308'}} gutterBottom noWrap>
                                {t('SetPasswordLabel')}
                            </Typography>
                            <img src={logo} alt='' className={classes.logo} />
                            <FormProvider {...methods}>
                                <form
                                    className={classes.form}
                                    onSubmit={handleSubmit(onSubmit)}>
                                    <FormControl fullWidth style={{ marginBottom: 8 }}>
                                        <InputController
                                            type={showPassword ? 'text' : 'password'}
                                            name='password'
                                            label={t('Password')}
                                            InputProps={{
                                                endAdornment: (
                                                <InputAdornment position='end'>
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        onMouseDown={(e) => e.preventDefault()}
                                                    >
                                                    {showPassword ? <VscEye /> : <VscEyeClosed />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        required
                                        rules={{
                                            minLength: {
                                            value: 6,
                                            message: t('PasswordMin6Letters'),
                                            },
                                        }}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth style={{ marginBottom: 16, marginTop: 8 }}>
                                        <InputController
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name='confirmPassword'
                                            label={t('ConfirmPassword')}
                                            required
                                            InputProps={{
                                                endAdornment: (
                                                <InputAdornment position='end'>
                                                    <IconButton
                                                        onClick={() => setShowConfirmPassword(!showPassword)}
                                                        onMouseDown={(e) => e.preventDefault()}
                                                    >
                                                    {showConfirmPassword ? <VscEye /> : <VscEyeClosed />}
                                                    </IconButton>
                                                </InputAdornment>
                                                ),
                                            }}
                                            rules={{
                                                validate: {
                                                matchPassword: (value) =>
                                                    value !== getValues('password')
                                                    ? t('PasswordNotMatch')
                                                    : true,
                                                },
                                            }}
                                        />
                                    </FormControl>
                                    <Button
                                        type='submit'
                                        variant='contained'
                                        style={{
                                          color: COLOR_WHITE,
                                          backgroundColor: COLOR_BUTTON_PRIMARY_BACKGROUND,
                                          marginTop: 16,
                                        }}
                                        fullWidth>
                                        {t('FinishRegistration')}
                                    </Button>
                                </form>
                            </FormProvider>
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

export default SetPasswordScreen;