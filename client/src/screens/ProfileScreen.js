import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import { Link as RouterLink } from 'react-router-dom';
import { Badge, Breadcrumbs, Container, FormControl ,Grid, Avatar, makeStyles, Link, Paper, Typography, Box, Button, InputLabel, Radio, FormControlLabel, FormHelperText, NativeSelect, RadioGroup, InputBase, fade, FormLabel } from '@material-ui/core';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { COLOR_BADGE_PRIMARY_BACKGROUND, COLOR_BUTTON_PRIMARY_BACKGROUND, COLOR_FORM_INPUT_ERROR, COLOR_WHITE } from '../constants/color.constants';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Meta from '../components/Meta';
import Message from '../components/Message';
import Loader from '../components/Loader';
import InputController from '../components/InputController';
import { getProfile, updateProfile, uploadLicense } from '../actions/user.action';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import de from 'react-phone-input-2/lang/de.json';
import VisibilityIcon from '@material-ui/icons/Visibility';
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

const StyledBadge = withStyles((theme) => ({
    root: {
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    badge: {
      backgroundColor: COLOR_BADGE_PRIMARY_BACKGROUND,
      color: COLOR_BADGE_PRIMARY_BACKGROUND,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }))(Badge);

const useStyles = makeStyles((theme) => ({
    underline: {
      "&&&:before": {
        borderBottom: "none"
      },
      "&&:after": {
        borderBottom: "none"
      }
    },
    noBorder: {
      border: "none",
    },
    breadcrumbsContainer: {
      ...theme.mixins.customize.breadcrumbs,
      paddingBottom: 0,
      '& .MuiBreadcrumbs-ol': {
        justifyContent: 'flex-start',
      },
    },
    content: {
      padding: 24,
      boxShadow: '0 10px 31px 0 rgba(0,0,0,0.05)',
    },
    paper: {
      // minHeight: 527,
      padding: 20,
      borderRadius: 10,
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
    },
    largeAvatar: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
    profile: {
      position: 'relative',
      ...theme.mixins.customize.flexMixin('center', 'center', 'column'),
      backgroundColor: '#F8F9FD',
      padding: 20,
      marginTop: theme.spacing(4),
      borderRadius: 10,
    },
    form: {
      padding: theme.spacing(2),
      '& .MuiInput-underline:before': {
        borderColor: 'rgba(224, 224, 224, 1)',
      },
      '& .MuiInput-input': {
        fontFamily: 'Poppins, sans-serif',
        fontSize: 13,
      },
    },
    linkColor: {
        color: '#000'
    }
}));

const ProfileScreen = ({ history }) => {
    const classes = useStyles();
    const methods = useForm();
    const { handleSubmit, setValue, control } = methods;
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const userLogin = useSelector((state) => state.userLogin);
    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const { loading, error, userInfo } = useSelector((state) => state.userGetProfile);
    const { upload_loading, upload_error, IsSuccess} = useSelector((state) => state.userUploadLicense);
    const [editMode, setEditMode] = useState(false);
    const [taxRequired, setTaxRequired] = useState(true);
    
    function isObjectEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
    
    useEffect(() => {
        if (userLogin) {
            if (!userLogin.userInfo) {
                history.push('/login');
            }
        }
    }, [userLogin, history]);

    useEffect(() => {
        if (userInfo) {
            console.log('profile', userInfo);
            if (isObjectEmpty(userInfo)) {
                if (userLogin) {
                    dispatch(getProfile({ email: userLogin.userInfo.email }));
                }
            } else {
                if (userInfo.editionBlocked) {
                    dispatch(openSnackbar(t('EditionBlocked'), 'warning'));
                }

                setValue('companyName', userInfo.companyName);
                setValue('corporationForm', userInfo.corporationForm);
                setValue('companyIdCode', userInfo.companyIdCode);
                setValue('name', (userInfo.nameSirCode === 'Mr' || userInfo.nameSirCode === 'Herr' ? t('SirMr') : t('SirMrs')) + ' ' + (userInfo.nameSirTitle && userInfo.nameSirTitle.length > 0 ? userInfo.nameSirTitle + '. ' : '')  + userInfo.nameFirst + ' ' + userInfo.nameLast);
                setValue('addressLine1', userInfo.addressStreet + ' ' + userInfo.addressHouse);
                setValue('addressLine2', userInfo.addressZipCode + ' ' + userInfo.addressCity);
                setValue('phoneNumber', userInfo.phoneNumber);
                setValue('faxNumber', userInfo.faxNumber);
                setValue('vatIdCode', userInfo.vatIdCode || ' ');
                setValue('taxIdCode', userInfo.taxIdCode || ' ');
                
                setValue('email', userInfo.email || '');
                setValue('invoiceEmail', userInfo.invoiceEmail || '');
                setValue('nameSirCode', userInfo.nameSirCode || ' ');
                setValue('nameSirTitle', userInfo.nameSirTitle || ' ');
                setValue('nameFirst', userInfo.nameFirst || ' ');
                setValue('nameLast', userInfo.nameLast || ' ');
                setValue('addressStreet', userInfo.addressStreet || ' ');
                setValue('addressHouse', userInfo.addressHouse || ' ');
                setValue('addressZipCode', userInfo.addressZipCode || ' ');
                setValue('addressCity', userInfo.addressCity || ' ');
            }
        }
    }, [userInfo, dispatch]);

    useEffect(() => {
        if (userUpdateProfile) {
            if (userUpdateProfile.IsSuccess && userLogin) {
                dispatch(openSnackbar(t('ProfileUpdateSuccess'), 'success'));
                dispatch(getProfile({ email: userLogin.userInfo.email }));
                setEditMode(false);
            }
        }
    }, [userUpdateProfile, dispatch, userLogin, t]);

    useEffect(() => {
        if (IsSuccess && userLogin) {
            dispatch(openSnackbar(t('LicenseUploadSuccess'), 'success'));
            dispatch(getProfile({ email: userLogin.userInfo.email }));
            setEditMode(false);
        }
    }, [IsSuccess, dispatch, t, userLogin]);

    useEffect(() => {
        if (error) {
            dispatch(openSnackbar(error, 'error'));
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (error) {
            dispatch(openSnackbar(upload_error, 'error'));
        }
    }, [upload_error, dispatch]);

    const TurnEditMode = () => {
        setEditMode(!editMode);
    }

    // FILE UPLOAD
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [businessLicense, setBusinessLicense] = useState(false);
    const [officialDocument, setOfficialDocument] = useState(false);
    
    const onBusinessLicenseFileChange = evt => {
        const file = evt.target.files[0];
        if (file && file.size < 1024 * 1024 *10) {
            setValue('businessLicense', file.name);
            setUploadSuccess(true);
            setBusinessLicense(file);
            setTimeout(() => { setUploadSuccess(false) }, 2000);
        }
    };

    const onOfficialDocumentFileChange = evt => {
        const file = evt.target.files[0];
        if (file && file.size < 1024 * 1024 *10) {
            setValue('officialDocument', file.name);
            setUploadSuccess(true);
            setOfficialDocument(file);
            setTimeout(() => { setUploadSuccess(false) }, 2000);
        }
    };

    const onSubmit = (data) => {
        dispatch(updateProfile(data));
    };

    const onUpload = () => {
        if (userInfo) {
            const formData = new FormData();
            formData.append('email', userInfo.email);
            if (businessLicense) {
                formData.append('businessLicense', businessLicense);
            }
            if (officialDocument) {
                formData.append('officialDocument', officialDocument);
            }
            dispatch(uploadLicense({ formData }));
        }
    };

    return (
        <Container maxWidth='xl' style={{ marginBottom: 48 }}>
            <Meta title={t('Profile')} />
            <Grid container className={classes.breadcrumbsContainer}>
                <Grid item xs={12}>
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize='small' />}
                        style={{ marginBottom: 24 }}>
                        <Link className={classes.linkColor} component={RouterLink} to='/'>
                            {t('Home')}
                        </Link>
                        <Link color='textPrimary' component={RouterLink} to='/profile'>
                            {t('Profile')}
                        </Link>
                    </Breadcrumbs>
                </Grid>
            </Grid>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                    <Paper className={classes.paper} elevation={0}>
                        {loading ? (
                            <Loader />
                        ) : error ? (
                            <Message>{error}</Message>
                        ) : (
                            <>
                                <Box className={classes.profile}>
                                    <StyledBadge
                                        overlap='circle'
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        variant='dot'>
                                        <Avatar
                                            src={`https://ui-avatars.com/api/?background=random&color=fff&name=${ userInfo && userInfo.nameLast ? userInfo.nameFirst + ' ' + userInfo.nameLast : "Pharma User"}`}
                                            className={classes.largeAvatar} />
                                    </StyledBadge>
                                    <Typography
                                        style={{ marginTop: 32 }}>
                                        {/* { nameFormatter(userInfo, t)} */}
                                        {  userInfo && ((userInfo.nameSirCode === 'Mr' ||userInfo.nameSirCode === 'Herr' ? t('SirMr') : t('SirMrs')) + ' ' + (userInfo.nameSirTitle && userInfo.nameSirTitle.length > 0 ? userInfo.nameSirTitle + '. ' : '')  + userInfo.nameFirst + ' ' + userInfo.nameLast) }
                                    </Typography>
                                    <Typography
                                        variant='caption'
                                        style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                                        { userInfo && userInfo.email }
                                    </Typography>
                                </Box>
                                <FormProvider {...methods}>
                                    <form className={classes.form}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth style={{ marginBottom: 12 }}>
                                                    <InputController
                                                        name='companyName'
                                                        label={t('CompanyName')}
                                                        InputProps={{
                                                        readOnly: true,
                                                        disableUnderline: true
                                                        }}                        
                                                    />
                                                </FormControl>
                                            </Grid>
                                            
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth style={{ marginBottom: 12 }}>
                                                    <InputController
                                                        name='corporationForm'
                                                        label={t('CorporateForm')}
                                                        InputProps={{
                                                        readOnly: true,
                                                        disableUnderline: true
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth style={{ marginBottom: 12 }}>
                                                    <InputController
                                                        name='companyIdCode'
                                                        label={t('CompanyIdCode')}
                                                        InputProps={{
                                                        readOnly: true,
                                                        disableUnderline: true
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth style={{ marginBottom: 12 }}>
                                                    <InputController
                                                        name='name'
                                                        label={t('Name')}
                                                        InputProps={{
                                                        readOnly: true,
                                                        disableUnderline: true
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth style={{ marginBottom: 12 }}>
                                                    <InputController
                                                        name='invoiceEmail'
                                                        label={t('InvoiceEmail')}
                                                        InputProps={{
                                                        readOnly: true,
                                                        disableUnderline: true
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth style={{ marginBottom: 12 }}>
                                                    <InputController
                                                        name='addressLine1'
                                                        label={t('PharmacyAddress')}
                                                        InputProps={{
                                                        readOnly: true,
                                                        disableUnderline: true
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormControl fullWidth style={{ marginTop: -8, marginBottom: 12 }}>
                                                    <InputController
                                                        name='addressLine2'
                                                        InputProps={{
                                                        readOnly: true,
                                                        disableUnderline: true
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth style={{ marginBottom: 12 }}>
                                                    <InputController
                                                        name='phoneNumber'
                                                        label={t('PhoneNumber')}
                                                        InputProps={{
                                                        readOnly: true,
                                                        disableUnderline: true
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth style={{ marginBottom: 12 }}>
                                                    <InputController
                                                        name='faxNumber'
                                                        label={t('FaxNumber')}
                                                        InputProps={{
                                                        readOnly: true,
                                                        disableUnderline: true
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth style={{ marginBottom: 12 }}>
                                                    <InputController
                                                        name='vatIdCode'
                                                        label={t('VatID')}
                                                        InputProps={{
                                                        readOnly: true,
                                                        disableUnderline: true
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth style={{ marginBottom: 12 }}>
                                                    <InputController
                                                        name='taxIdCode'
                                                        label={t('TaxID')}              
                                                        InputProps={{
                                                        readOnly: true,
                                                        disableUnderline: true
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box display='flex' justifyContent={"flex-end"} pt={1}>
                                                    <Button  
                                                        variant='contained'
                                                        disabled={userInfo && userInfo.editionBlocked}
                                                        style={{
                                                            color: COLOR_WHITE,
                                                            backgroundColor: COLOR_BUTTON_PRIMARY_BACKGROUND}}
                                                        onClick={TurnEditMode}>
                                                        { editMode ? t('Cancel') : t('Edit')}
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </FormProvider>
                            </>
                        )}
                    </Paper>
                </Grid>
                {editMode 
                ? (<Grid item xs={12} sm={6}>
                    <Paper className={classes.paper} elevation={0}>
                        <FormProvider {...methods}>
                            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant='h5' gutterBottom>
                                            {t('SignupProfileInformation') + ' : '}
                                        </Typography>
                                        <Typography variant='subtitle1' gutterBottom>
                                            {t('SignupProfileInstructionText')}
                                        </Typography> <br />
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
                                    {/* <Grid item xs={12}>
                                        <Controller
                                            name='email'
                                            control={control}
                                            defaultValue=''
                                            render={({ field, fieldState: { error } }) => (
                                                <FormControl fullWidth error={!!error}>
                                                    <InputLabel shrink htmlFor='signup-email'>
                                                        {t('Email')}
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
                                    </Grid> */}
                                    <Grid item xs={12} sm={6}>
                                        <Controller
                                            name='nameSirCode'
                                            control={control}
                                            defaultValue=''
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
                                                        {t('SirTitle')} *
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
                                                        {t('VatID')} *
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
                                                            e.target.value = e.target.value.length > 0 ? Math.max(0, parseInt(e.target.value.replace(/[^0-9]/g, '')) ).toString().slice(0,11) : ''
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
                                                disabled={userInfo && userInfo.editionBlocked}
                                                style={{
                                                color: COLOR_WHITE,
                                                backgroundColor:COLOR_BUTTON_PRIMARY_BACKGROUND
                                            }}>
                                                {t('Update')}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>
                        </FormProvider>
                    </Paper>
                </Grid>) 
                : (<Grid item xs={12} sm={6}>
                    <Paper className={classes.paper} elevation={0}>
                        <Grid item sm={12}>
                            <Typography variant='h5' gutterBottom>
                                {t('UploadLicenseDocumentLabel')}
                            </Typography>
                            <Typography variant='subtitle1' gutterBottom>
                                {t('UploadLicenseDocumentInstruction')}
                            </Typography>
                            <br />
                            <FormProvider id='uploadLicenseForm' {...methods}>
                                <form className={classes.form} onSubmit={handleSubmit(onUpload)}>
                                    <Grid container spacing={2}>
                                        { userInfo && userInfo.businessLicenseNeedUpload ? <>
                                            <Grid item xs={12} sm={8}>
                                                <FormControl fullWidth>
                                                    <InputController name='businessLicense' label={`${t('BusinessLicense')} *`} InputProps={{ readOnly: true }} />
                                                    {/* {!businessLicenseValid && (
                                                        <FormHelperText error>{t('DocumentFieldRequired')}</FormHelperText>
                                                    )} */}
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '4px' }}>
                                                    <label htmlFor='upload-businessLicense'>
                                                        <input
                                                            style={{ display: 'none' }}
                                                            id="upload-businessLicense"
                                                            name="upload-businessLicense"
                                                            type="file"
                                                            accept=".pdf,.png,.jpg"
                                                            max-size='10000000'
                                                            disabled={userInfo && userInfo.editionBlocked}
                                                            onChange={onBusinessLicenseFileChange} 
                                                        />
                                                        <Button
                                                            style={{
                                                                color: COLOR_WHITE,
                                                                backgroundColor: COLOR_BUTTON_PRIMARY_BACKGROUND
                                                            }}
                                                            disabled={userInfo && userInfo.editionBlocked}
                                                            variant='contained' component='span' >
                                                            {t('Upload')}
                                                        </Button>
                                                    </label>
                                                </Box>
                                                <br />
                                            </Grid>
                                        </> : <>
                                            <Grid item xs={12} sm={7}>
                                                <Typography variant='subtitle1' gutterBottom>
                                                    {t('BusinessLicense')}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={5}>
                                                <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '4px' }}>
                                                    <Button 
                                                        variant='contained'
                                                        style={{
                                                            backgroundColor: COLOR_WHITE,
                                                            color: COLOR_BUTTON_PRIMARY_BACKGROUND
                                                        }}
                                                        startIcon={<VisibilityIcon />}
                                                        href={userInfo && userInfo.businessLicense ? userInfo.businessLicense.url : '#'}
                                                        target='_blank'>
                                                        {t('Open')}
                                                    </Button>
                                                </Box>
                                            </Grid>
                                            {/* <Grid item xs={12} sm={4}>
                                                <Box display='flex' justifyContent={"flex-center"}>
                                                    <Button 
                                                        variant='contained'
                                                        style={{
                                                            color: COLOR_WHITE,
                                                            backgroundColor: COLOR_BUTTON_PRIMARY_BACKGROUND
                                                        }}
                                                        startIcon={<CloudDownloadIcon />}
                                                        onClick={() => {
                                                            if (userInfo && userInfo.businessLicense) {
                                                                window.open(userInfo.businessLicense.url, "_blank", 'fullscreen=yes');
                                                            }
                                                        }}>
                                                        {t('Download')}
                                                    </Button>
                                                </Box>
                                            </Grid>  */}
                                            <br />
                                        </>}
                                        { userInfo && userInfo.officialDocumentNeedUpload ? <>
                                            <Grid item xs={12} sm={8}>
                                                <FormControl fullWidth>
                                                    <InputController name='officialDocument' label={t('OfficialDocument')} InputProps={{ readOnly: true }} />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '4px' }}>
                                                    <label htmlFor='upload-officialDocument'>
                                                        <input
                                                            style={{ display: 'none' }}
                                                            id="upload-officialDocument"
                                                            name="upload-officialDocument"
                                                            type="file"
                                                            accept=".pdf,.png,.jpg"
                                                            max-size='10000000'
                                                            disabled={userInfo && userInfo.editionBlocked}
                                                            onChange={onOfficialDocumentFileChange}
                                                        />
                                                        <Button
                                                            style={{
                                                                color: COLOR_WHITE,
                                                                backgroundColor: COLOR_BUTTON_PRIMARY_BACKGROUND
                                                            }}
                                                            disabled={userInfo && userInfo.editionBlocked}
                                                            variant='contained' component='span' >
                                                            {t('Upload')}
                                                        </Button>
                                                    </label>
                                                </Box>
                                            </Grid>
                                        </> : <>
                                            <Grid item xs={12} sm={7}>
                                                <Typography variant='subtitle1' gutterBottom>
                                                    {t('OfficialDocument')}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={5}>
                                                <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '4px' }}>
                                                    <Button 
                                                        variant='contained'
                                                        style={{
                                                            backgroundColor: COLOR_WHITE,
                                                            color: COLOR_BUTTON_PRIMARY_BACKGROUND
                                                        }}
                                                        startIcon={<VisibilityIcon />}
                                                        href={userInfo && userInfo.officialDocument ? userInfo.officialDocument.url : '#'}
                                                        target='_blank'>
                                                        {t('Open')}
                                                    </Button>
                                                </Box>
                                            </Grid>
                                            {/* <Grid item xs={12} sm={4}>
                                                <Box display='flex' justifyContent={"flex-center"}>
                                                    <Button 
                                                        variant='contained'
                                                        style={{
                                                            color: COLOR_WHITE,
                                                            backgroundColor: COLOR_BUTTON_PRIMARY_BACKGROUND
                                                        }}
                                                        startIcon={<CloudDownloadIcon />}
                                                        onClick={() => {
                                                            if (userInfo && userInfo.officialDocument) {
                                                                window.open(userInfo.officialDocument.url, "_blank", 'fullscreen=yes');
                                                            }
                                                        }}>
                                                        {t('Download')}
                                                    </Button>
                                                </Box>
                                            </Grid> */}
                                            <br />
                                        </> }
                                    </Grid>
                                    
                                    {userInfo && (userInfo.businessLicenseNeedUpload || userInfo.officialDocumentNeedUpload) ? 
                                    <>
                                        <Box mt={4}>
                                            <FormLabel htmlFor='uploadLicenseForm'>
                                                {t('UploadLicenseLabel')}
                                            </FormLabel>  <br /><br />
                                        </Box>

                                        <Grid container spacing={2}>
                                            {uploadSuccess &&
                                                <Grid item xs={12}>
                                                    <Message severity='success' mt={8}>
                                                        {t('UploadedSucessful')}
                                                    </Message>
                                                </Grid>}
                                            <Grid item xs={12} sm={10}>
                                                <Box display='flex' justifyContent={"flex-end"} pt={1}>
                                                    <Button 
                                                        type='submit'
                                                        variant='contained'
                                                        disabled={userInfo && userInfo.editionBlocked}
                                                        style={{
                                                            color: COLOR_WHITE,
                                                            backgroundColor: COLOR_BUTTON_PRIMARY_BACKGROUND
                                                        }}>
                                                        {t('Save')}
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </> : <></>}
                                    
                                </form>
                            </FormProvider>
                            
                            <Box my={2} mt={2}>
                                {upload_loading && <Loader my={0} />}
                                {/* {upload_error && <Message mt={0}>{upload_error}</Message>} */}
                            </Box>
                        </Grid>
                   </Paper>
                </Grid>)}
            </Grid>
        </Container>
    );
};

export default ProfileScreen;