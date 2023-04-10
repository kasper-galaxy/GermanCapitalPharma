import React, { useRef, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
    Box,
    Button, 
    createMuiTheme, 
    FormControl, 
    Grid, 
    IconButton, 
    InputAdornment, 
    makeStyles, 
    Paper, 
    ThemeProvider,
    Link
} from '@material-ui/core';
import queryString from 'query-string';
import { useForm, FormProvider } from 'react-hook-form';
import { VscEyeClosed, VscEye } from 'react-icons/vsc';
import { BiArrowBack } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';
import InputController from '../components/InputController';
import logo from '../assets/images/logo.png';
import backgroundImage from '../assets/images/background.jpg';
import config from '../config';
import { COLOR_BUTTON_PRIMARY_BACKGROUND, COLOR_WHITE } from '../constants/color.constants';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../actions/user.action';
import Loader from '../components/Loader';
// import Message from '../components/Message';
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
    },
}));

const LoginScreen = ({ location, history }) => {
    const classes = useStyles();
    const methods = useForm();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { redirect = '/' } = queryString.parse(location.search);
    const [showPassword, setShowPassword] = useState(false);
    const [captchaValue, setCaptchaValue] = useState('');
    const { loading, error, IsSuccess, userInfo } = useSelector((state) => state.userLogin);
    const recaptchaRef = useRef(null);

    const { handleSubmit } = methods;

    const captchaChange = (v) => {
        setCaptchaValue(v)
    }

    useEffect(() => {
        if (IsSuccess && userInfo && !userInfo.isAdmin) {
            if (userInfo.newBee == 1) {
                dispatch(openSnackbar(t('Welcome'), 'success'));
            }
            console.log('userinfo', userInfo);

            if(typeof userInfo === 'object') {
                if ('proxyToken' in userInfo) {
                    console.log('proxy ', userInfo.proxyToken)
                    history.push('/set-password/token=' + userInfo.proxyToken);
                } 
                else if ('email' in userInfo) {
                    console.log('email');
                    history.push('/');
                }
            } else {
                window.location.href = '/admin';
            }
        }
    }, [IsSuccess, userInfo, history, dispatch, t]);

    useEffect(() => {
        if (error) {
            dispatch(openSnackbar(error, 'error'));
        }
    }, [error, dispatch]);

    const submitHandler = ({ email, password }) => {
        dispatch(login({ email, password, captchaValue }));
    };

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
                            <FormProvider {...methods}>
                                <form
                                    className={classes.form}
                                    onSubmit={handleSubmit(submitHandler)}>
                                    <FormControl fullWidth style={{ marginBottom: 16 }}>
                                        <InputController 
                                            name='email'
                                            label={t('Email')}
                                            required
                                            rules={{
                                              pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: t('InvalidEmailAddress'),
                                              },
                                            }}/>
                                    </FormControl>
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
                                    <Box display='flex' justifyContent='flex-start' pb={2} pt={1}>
                                        <ReCAPTCHA 
                                            ref={recaptchaRef}
                                            sitekey={config.Recaptcha_Site_Key}
                                            onChange={captchaChange}
                                            lang='de'/>
                                    </Box>
                                    <Box display='flex' justifyContent='flex-end' pb={2} pt={1}>
                                        <Link component={RouterLink} to='/forgot-password'>
                                            {t('ForgotPassword')}
                                        </Link>
                                    </Box>
                                    <Button
                                        type='submit'
                                        variant='contained'
                                        style={{
                                            color: COLOR_WHITE,
                                            backgroundColor: COLOR_BUTTON_PRIMARY_BACKGROUND
                                        }}
                                        fullWidth>
                                        {t('SignIn')}
                                    </Button>
                                </form>
                            </FormProvider>
                            <Box my={2} mt={2}>
                                {t('NewCustomer')}&nbsp;&nbsp;&nbsp;
                                <Link
                                    component={RouterLink}
                                    to={`/signup/profile?redirect=${redirect}`}>
                                  {t('CreateAccount')}
                                </Link>
                            </Box>
                            <Box my={2} mt={2}>
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

export default LoginScreen;