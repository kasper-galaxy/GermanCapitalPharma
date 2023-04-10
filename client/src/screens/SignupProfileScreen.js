import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Breadcrumbs, Button, Container, fade, FormControl, FormControlLabel, FormHelperText, Grid, InputBase, InputLabel, Link, makeStyles, NativeSelect, Paper, Radio, RadioGroup, Typography } from '@material-ui/core';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { withStyles } from '@material-ui/styles';
import PhoneInput from 'react-phone-input-2';
import de from 'react-phone-input-2/lang/de.json';
import 'react-phone-input-2/lib/style.css';
import Meta from '../components/Meta';
import SignupSteps from '../components/Step/SignupSteps';
import { COLOR_BUTTON_PRIMARY_BACKGROUND, COLOR_FORM_INPUT_ERROR, COLOR_WHITE } from '../constants/color.constants';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { checkEmailDuplicate } from '../actions/user.action';
import { USER_CHECK_EMAIL_DUPLICATE_RESET } from '../constants/user.constant';
import { openSnackbar } from '../actions/snackbar.action';

const Input = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
        '&.Mui-error $input': {
            borderColor: COLOR_FORM_INPUT_ERROR,
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette.primary.main,
        },
    },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
    breadcrumbsContainer: {
      ...theme.mixins.customize.breadcrumbs,
    },
    form: {
      '& > *': {
        marginBottom: 16,
      },
    },
    boxContainer: {
      position: 'relative',
      ...theme.mixins.customize.flexMixin('center', 'center', 'column'),
      padding: '24px 25%',
      height: '100%',
      [theme.breakpoints.down('xs')]: {
        padding: '24px 10%',
      },
    },
    content: {
      padding: 24,
      boxShadow: '0 10px 31px 0 rgba(0,0,0,0.05)',
    },
    input: {
      '& input[type=number]': {
          '-moz-appearance': 'textfield'
      },
      '& input[type=number]::-webkit-outer-spin-button': {
          '-webkit-appearance': 'none',
          margin: 0
      },
      '& input[type=number]::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
          margin: 0
      }
    },
    linkColor: {
        color: '#000'
    }
}));

const SignupProfileScreen = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const methods = useForm();
    const { handleSubmit, control, setValue } = methods;
    const { t } = useTranslation();
    const { loading, error, IsSuccess } = useSelector((state) => state.userCheckEmail);

    let initialRegData = true;
    let regData = localStorage.getItem('reg_profile');
    if (regData) {
        regData = JSON.parse(regData);

        if (regData.vatIdCode && regData.vatIdCode.length > 0) {
            initialRegData = false;
        }
    }

    const [taxRequired, setTaxRequired] = useState(initialRegData);

    const onSubmit = (data) => {
        regData = { ...regData, ...data};
        localStorage.setItem('reg_profile', JSON.stringify(regData));
        dispatch(checkEmailDuplicate({ email: data.email } ));
    };

    useEffect(() => {
        if (regData) {
            setValue('companyName', regData.companyName || '');
            setValue('corporationForm', regData.corporationForm || t('CorporateFormOHG'));
            setValue('email', regData.email || '');
            setValue('invoiceEmail', regData.invoiceEmail || '');
            setValue('nameSirCode', regData.nameSirCode || t('SirMr'));
            setValue('nameSirTitle', regData.nameSirTitle || '');
            setValue('nameFirst', regData.nameFirst || '');
            setValue('nameLast', regData.nameLast || '');
            setValue('addressStreet', regData.addressStreet || '');
            setValue('addressHouse', regData.addressHouse || '');
            setValue('addressZipCode', regData.addressZipCode || '');
            setValue('addressCity', regData.addressCity || '');
            setValue('phoneNumber', regData.phoneNumber || '');
            setValue('faxNumber', regData.faxNumber || '');
            setValue('vatIdCode', regData.vatIdCode || '');
            setValue('taxIdCode', regData.taxIdCode || '');
            setValue('companyIdCode', regData.companyIdCode || '');
        }
    }, []);

    useEffect(() => {
        if (IsSuccess) {
            dispatch({ type: USER_CHECK_EMAIL_DUPLICATE_RESET });
            // console.log('submit ', data);
            history.push('/signup/license');
        }
    }, [IsSuccess, history, dispatch]);

    useEffect(() => {
        if (error) {
            dispatch(openSnackbar(error, 'error'));
        }
    }, [error, dispatch]);

    return (
        <Container maxWidth='xl' style={{ marginBottom: 48 }}>
            <Meta title={t('SignUp') + ' | ' + t('PharmacyStore')} />
            <Grid container className={classes.breadcrumbsContainer}>
                <Grid item xs={12}>
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize='small' />}
                        style={{ marginBottom: 24 }}>
                        <Link className={classes.linkColor} underline='none'>
                            {t('SignUp')}
                        </Link>
                        <Link color='textPrimary' underline='none'>
                            {t('SignupProfileInformation')}
                        </Link>
                    </Breadcrumbs>
                    <SignupSteps step={0} />
                </Grid>
            </Grid>
            <Box className={classes.boxContainer}>
                <Paper elevation={0} className={classes.content} square>
                    <Grid container spacing={8}>
                        <Grid item sm={12}>
                            <Typography variant='h5' gutterBottom>
                                {t('SignupProfileInformation') + ' : '}
                            </Typography>
                            <Typography variant='subtitle1' gutterBottom>
                                {t('SignupProfileInstructionText')}
                            </Typography>

                            <FormProvider {...methods}>
                                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Controller 
                                                name='companyName'
                                                control={control}
                                                defaultValue=''
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel shrink htmlFor='signup-companyname'>
                                                            {t('CompanyName')} *
                                                        </InputLabel>
                                                        <Input {...field} id='signup-companyname' fullWidth />{' '}
                                                        {error && (
                                                            <FormHelperText error>{error.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                                rules={{ required: t('ThisFieldRequired')+'' }} 
                                                />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Controller 
                                                name='corporationForm'
                                                control={control}
                                                defaultValue={t('CorporateFormOHG')}
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel shrink htmlFor='signup-corporationform'>
                                                            {t('CorporateForm')}
                                                        </InputLabel>
                                                        <Grid container spacing={2} style={{ marginTop: '8px', marginBottom: '-16px' }}>
                                                            <Grid item xs={12} sm={6}>
                                                                <RadioGroup {...field} aria-label='corporationForm' id='signup-corporationform' style={{ flexDirection:"row" }}>
                                                                    <FormControlLabel value={t('CorporateFormOHG')} control={<Radio />} label={t('CorporateFormOHG')} />
                                                                    <FormControlLabel value={t('CorporateFormEK')} control={<Radio />} label={t('CorporateFormEK')} />
                                                                </RadioGroup>
                                                            </Grid>
                                                        </Grid>
                                                    </FormControl>
                                                )}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Controller
                                                name='email'
                                                control={control}
                                                defaultValue=''
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel shrink htmlFor='signup-email'>
                                                            {t('Email')} *
                                                        </InputLabel>
                                                        <Input {...field} id='signup-email' fullWidth />{' '}
                                                        {error && (
                                                        <FormHelperText error>{error.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                                rules={{ 
                                                  required: t('ThisFieldRequired')+'',
                                                  pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: t('InvalidEmailAddress'),
                                                  },
                                                }}
                                                />
                                            {(loading || error) && 
                                                <Box my={2} mt={4}>
                                                    {loading && <Loader my={0} />}
                                                    {error && <Message mt={0}>{error}</Message>}                                
                                                </Box>
                                            }
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Controller
                                                name='invoiceEmail'
                                                control={control}
                                                defaultValue=''
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel shrink htmlFor='signup-invoiceemail'>
                                                            {t('InvoiceEmail')} *
                                                        </InputLabel>
                                                        <Input {...field} id='signup-invoiceemail' fullWidth />{' '}
                                                        {error && (
                                                        <FormHelperText error>{error.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                                rules={{ 
                                                  pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: t('InvalidEmailAddress'),
                                                  },
                                                }}
                                                />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='nameSirCode'
                                                control={control}
                                                defaultValue={'Mr'}
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel shrink htmlFor='signup-namesircode'>
                                                            {t('SirCode')} *
                                                        </InputLabel>
                                                        <NativeSelect
                                                            {...field}
                                                            id="signup-namesircode"
                                                            name="sirCode"
                                                            style={{
                                                                minHeight: "48px"
                                                            }}
                                                            inputProps={{ 'aria-label': 'sirCode' }}>
                                                            <option value={'Mr'}>{t('SirMr')}</option>
                                                            <option value={'Mrs'}>{t('SirMrs')}</option>
                                                        </NativeSelect>
                                                    </FormControl>
                                                )} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='nameSirTitle'
                                                control={control}
                                                defaultValue=''
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel shrink htmlFor='signup-namesirtitle'>
                                                            {t('SirTitle')}
                                                        </InputLabel>
                                                        <Input {...field} id='signup-namesirtitle' />{' '}
                                                        {error && (
                                                            <FormHelperText error>{error.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='nameFirst'
                                                control={control}
                                                defaultValue=''
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel shrink htmlFor='signup-namefirst'>
                                                            {t('FirstName')} *
                                                        </InputLabel>
                                                        <Input {...field} id='signup-namefirst' />{' '}
                                                        {error && (
                                                            <FormHelperText error>{error.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                                rules={{ 
                                                  required: t('ThisFieldRequired')+'',
                                                }} 
                                                />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='nameLast'
                                                control={control}
                                                defaultValue=''
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel shrink htmlFor='signup-namelast'>
                                                            {t('LastName')} *
                                                        </InputLabel>
                                                        <Input {...field} id='signup-namelast' />{' '}
                                                        {error && (
                                                            <FormHelperText error>{error.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                                rules={{ 
                                                  required: t('ThisFieldRequired')+'',
                                                }} 
                                                />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>
                                                {t('PharmacyAddress')}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='addressStreet'
                                                control={control}
                                                defaultValue=''
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel shrink htmlFor='signup-addressstreet'>
                                                            {t('AddressStreet')} *
                                                        </InputLabel>
                                                        <Input {...field} id='signup-addressstreet' />{' '}
                                                        {error && (
                                                            <FormHelperText error>{error.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                                rules={{ 
                                                  required: t('ThisFieldRequired')+'',
                                                }} 
                                                />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='addressHouse'
                                                control={control}
                                                defaultValue=''
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel shrink htmlFor='signup-addresshouse'>
                                                            {t('AddressHouseNumber')} *
                                                        </InputLabel>
                                                        <Input {...field} id='signup-addresshouse' />{' '}
                                                        {error && (
                                                            <FormHelperText error>{error.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                                rules={{ 
                                                  required: t('ThisFieldRequired')+'',
                                                }} 
                                                />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='addressZipCode'
                                                control={control}
                                                defaultValue=''
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel shrink htmlFor='signup-addresszipcode'>
                                                            {t('AddressZipCode')} *
                                                        </InputLabel>
                                                        <Input {...field} id='signup-addresszipcode' />{' '}
                                                        {error && (
                                                            <FormHelperText error>{error.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                                rules={{ 
                                                  required: t('ThisFieldRequired')+'',
                                                }} 
                                                />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='addressCity'
                                                control={control}
                                                defaultValue=''
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel shrink htmlFor='signup-addresscity'>
                                                            {t('AddressCity')} *
                                                        </InputLabel>
                                                        <Input {...field} id='signup-addresscity' />{' '}
                                                        {error && (
                                                            <FormHelperText error>{error.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                                rules={{ 
                                                  required: t('ThisFieldRequired')+'',
                                                }} 
                                                />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='phoneNumber'
                                                control={control}
                                                defaultValue=''
                                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel shrink htmlFor='signup-phonenumber'>
                                                            {t('PhoneNumber')} *
                                                        </InputLabel>
                                                        <PhoneInput 
                                                            id="signup-phonenumber"
                                                            placeholder="+49 2383 4726"
                                                            country={'de'} 
                                                            localization={de}
                                                            style={{
                                                              marginTop: "24px",
                                                            }}
                                                            inputStyle={{
                                                              width: "100%",
                                                              height: "42px"
                                                            }} 
                                                            onChange={(value, country, e, formattedValue) => {
                                                                onChange(formattedValue)
                                                            }}
                                                            value={value}
                                                            fullWidth/>
                                                            {error && (
                                                                <FormHelperText error>{error.message}</FormHelperText>
                                                            )}
                                                    </FormControl>
                                                )}
                                                rules={{ 
                                                  required: t('ThisFieldRequired')+'',
                                                }} 
                                                />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='faxNumber'
                                                control={control}
                                                defaultValue=''
                                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel shrink htmlFor='signup-faxnumber'>
                                                            {t('FaxNumber')} *
                                                        </InputLabel>
                                                        <PhoneInput
                                                            id="signup-faxnumber"
                                                            placeholder="+49 2463 5963"
                                                            country={'de'} 
                                                            localization={de}
                                                            style={{
                                                              marginTop: "24px",
                                                            }}
                                                            inputStyle={{
                                                              width: "100%",
                                                              height: "42px"
                                                            }} 
                                                            onChange={(value, country, e, formattedValue) => {
                                                                onChange(formattedValue)
                                                            }}
                                                            value={value}
                                                            fullWidth/>
                                                            {error && (
                                                                <FormHelperText error>{error.message}</FormHelperText>
                                                            )}
                                                    </FormControl>
                                                )}
                                                rules={{ 
                                                  required: t('ThisFieldRequired')+'',
                                                }} 
                                                />
                                        </Grid>
                                        
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='vatIdCode'
                                                control={control}
                                                defaultValue=''
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel shrink htmlFor='signup-vatidcode'>
                                                            {t('VatID')}
                                                        </InputLabel>
                                                        <Input {...field} id='signup-vatidcode' onInput={(e) => {
                                                            setTaxRequired(e.target.value.length > 0 ? false : true);
                                                        }} />{' '}
                                                        {error && (
                                                            <FormHelperText error>{error.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )} />
                                        </Grid>
                                        
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='taxIdCode'
                                                control={control}
                                                defaultValue=''
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel shrink htmlFor='signup-taxidcode'>
                                                            {t('TaxID')} *
                                                        </InputLabel>
                                                        <Input {...field} id='signup-taxidcode'
                                                            type='tel' onInput = {(e) =>{
                                                                e.target.value = e.target.value.length > 0 ? Math.max(0, parseInt(e.target.value.replace(/[^0-9]/g, '')) ).toString() : ''
                                                                if (e.target.value === 'NaN') {
                                                                    e.target.value = ''
                                                        }}} />{' '}
                                                        {error && (
                                                            <FormHelperText error>{error.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                                rules={{ 
                                                  minLength: {
                                                    value: 11,
                                                    message: t('Require11Digits'),
                                                  },
                                                  required: taxRequired ? t('ThisFieldRequired') : false,
                                                }} 
                                                />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='companyIdCode'
                                                control={control}
                                                defaultValue=''
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>
                                                        <InputLabel shrink htmlFor='signup-companyidcode'>
                                                            {t('CompanyIdCode')} *
                                                        </InputLabel>
                                                        <Input {...field} id='signup-companyidcode' />{' '}
                                                        {error && (
                                                            <FormHelperText error>{error.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                                rules={{ 
                                                  required: t('ThisFieldRequired')+'',
                                                }} 
                                                />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Box display='flex' justifyContent='flex-end' mt={3}>
                                                <Button 
                                                    type='submit' 
                                                    variant='contained'
                                                    style={{
                                                    color: COLOR_WHITE,
                                                    backgroundColor:COLOR_BUTTON_PRIMARY_BACKGROUND
                                                }}>
                                                    {t('Next')}
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </form>
                            </FormProvider>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
};

export default SignupProfileScreen;