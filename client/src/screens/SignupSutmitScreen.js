import React, { useEffect } from 'react';
import { Breadcrumbs, Container, Grid, makeStyles, Link, Box, Paper, Typography, FormControl, InputLabel, Button } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Link as RouterLink } from 'react-router-dom';
import Meta from '../components/Meta';
import SignupSteps from '../components/Step/SignupSteps';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/user.action';
import { openSnackbar } from '../actions/snackbar.action';
import Loader from '../components/Loader';
import { getFormDataFromObject } from '../utils';

const useStyles = makeStyles((theme) => ({
    breadcrumbsContainer: {
      ...theme.mixins.customize.breadcrumbs,
    },
    form: {
      '& > *': {
        marginBottom: 8,
      },
    },
    content: {
      padding: 24,
      boxShadow: '0 10px 31px 0 rgba(0,0,0,0.05)',
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
    linkColor: {
        color: '#000'
    }
}));

const SignupSubmitScreen = ({ history }) => {
    const classes = useStyles();
    const methods = useForm();
    const dispatch = useDispatch();
    const { handleSubmit, control, setValue } = methods;
    const { t } = useTranslation();

    const { loading, error, IsSuccess, userInfo } = useSelector((state) => state.userRegister);
    const { documents } = useSelector((state) => state.userLicense);
    const { businessLicense, officialDocument } = documents; 
    let regData = localStorage.getItem('reg_profile');

    if (regData) {
        regData = JSON.parse(regData);
    } else {
        history.push(('/signup/license'));
    }

    useEffect(() => {
        if (regData) {
            setValue('companyName', regData.companyName || '');
            setValue('corporationForm', regData.corporationForm || t('CorporateFormOHG'));
            setValue('email', regData.email || '');
            setValue('invoiceEmail', regData.invoiceEmail || '');
            setValue('nameSirCode', regData.nameSirCode ? regData.nameSirCode === 'Mr' ? t('SirMr') : t('SirMrs') : t('SirMr'));
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
            setValue('name',  (regData.nameSirCode === 'Mr' ? t('SirMr') : t('SirMrs')) + ' ' + (regData.nameSirTitle && regData.nameSirTitle.length > 0 ? regData.nameSirTitle + '. ' : '')  + regData.nameFirst + ' ' + regData.nameLast);
            setValue('address', regData.addressStreet + ' ' + regData.addressHouse + ', ' + regData.addressZipCode + ' ' + regData.addressCity);
            setValue('phoneNumber', regData.phoneNumber || '');
        }
    }, []);

    useEffect(() => {
        if (!businessLicense) {
            history.push(('/signup/license'));
        }
    }, [businessLicense, officialDocument, history]);

    useEffect(() => {
        if (IsSuccess && userInfo && userInfo.email) {
            // dispatch(openSnackbar(t('Welcome'), 'success'));
            history.push(('/check-email'));
        }
    }, [IsSuccess, userInfo, history]);

    useEffect(() => {
        if (error) {
            dispatch(openSnackbar(error, 'error'));
        }
    }, [error, dispatch]);

    const onSubmit = (data) => {
        delete data.name;
        delete data.address;
        delete data.businessLicense;
        delete data.officialDocument;

        data.nameSirCode = data.nameSirCode === t('SirMr') ? 'Mr' : 'Mrs';

        const formData = getFormDataFromObject(data);
        formData.append('businessLicense', businessLicense);
        if (officialDocument) {
            formData.append('officialDocument', officialDocument);
        }
        // for (var pair of formData.entries()) {
        //     console.log(pair[0]+ ', ' + pair[1]); 
        // }
        dispatch(register({ formData }));
    }

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
                        <Link className={classes.linkColor} underline='none'>
                            {t('SignupProfileInformation')}
                        </Link>
                        <Link className={classes.linkColor} underline='none'>
                            {t('SignupUploadDocuments')}
                        </Link>
                        <Link color='textPrimary' underline='none'>
                            {t('SignupSubmission')}
                        </Link>
                    </Breadcrumbs>
                    <SignupSteps step={2} />
                </Grid>
            </Grid>
            <Box className={classes.boxContainer}>
                <Paper elevation={0} className={classes.content} square>
                    <Grid container spacing={8}>
                        <Grid item sm={12}>
                            <Typography variant='h5' gutterBottom>
                                {t('SignupSubmission')+':'}
                            </Typography>
                            <Typography variant='subtitle1' gutterBottom>
                                {t('ReviewYourEntries')}
                            </Typography> <br />
                            <FormProvider {...methods}>
                                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                                    <Grid container spacing={1}> 
                                        <Grid item xs={12}>
                                            <Controller
                                                name='companyName'
                                                control={control}
                                                render={({ field: { value }, fieldState: { error } }) => (
                                                <FormControl fullWidth error={!!error}>
                                                    <InputLabel shrink>
                                                        {t('CompanyName')}
                                                    </InputLabel>
                                                    <Typography id='signup-company' variant='subtitle1' gutterBottom  style={{marginTop: '16px'}}>{value}</Typography>
                                                </FormControl>
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Controller
                                                name='corporationForm'
                                                control={control}
                                                render={({ field: { value }, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>                          
                                                        <InputLabel shrink>
                                                            {t('CorporateForm')}
                                                        </InputLabel>
                                                        <Typography variant='subtitle1' gutterBottom style={{marginTop: '16px'}}>{value}</Typography>
                                                    </FormControl>
                                                )}
                                            />  
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='email'
                                                control={control}
                                                render={({ field: { value }, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>                          
                                                        <InputLabel shrink>
                                                            {t('Email')}
                                                        </InputLabel>
                                                        <Typography variant='subtitle1' gutterBottom style={{marginTop: '16px'}}>{value}</Typography>
                                                    </FormControl>
                                                )}
                                            />  
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='invoiceEmail'
                                                control={control}
                                                render={({ field: { value }, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>                          
                                                        <InputLabel shrink>
                                                            {t('InvoiceEmail')}
                                                        </InputLabel>
                                                        <Typography variant='subtitle1' gutterBottom style={{marginTop: '16px'}}>{value}</Typography>
                                                    </FormControl>
                                                )}
                                            />  
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Controller
                                                name='name'
                                                control={control}
                                                render={({ field: { value }, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>                          
                                                        <InputLabel shrink>
                                                            {t('Name')}
                                                        </InputLabel>
                                                        <Typography variant='subtitle1' gutterBottom style={{marginTop: '16px'}}>{value}</Typography>
                                                    </FormControl>
                                                )}
                                            />  
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Controller
                                                name='address'
                                                control={control}
                                                render={({ field: { value }, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>                          
                                                        <InputLabel shrink>
                                                            {t('PharmacyAddress')}
                                                        </InputLabel>
                                                        <Typography variant='subtitle1' gutterBottom style={{marginTop: '16px'}}>{value}</Typography>
                                                    </FormControl>
                                                )}
                                            />  
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='phoneNumber'
                                                control={control}
                                                render={({ field: { value }, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>                          
                                                        <InputLabel shrink>
                                                            {t('PhoneNumber')}
                                                        </InputLabel>
                                                        <Typography variant='subtitle1' gutterBottom style={{marginTop: '16px'}}>{value}</Typography>
                                                    </FormControl>
                                                )}
                                            />  
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='faxNumber'
                                                control={control}
                                                render={({ field: { value }, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>                          
                                                        <InputLabel shrink>
                                                            {t('FaxNumber')}
                                                        </InputLabel>
                                                        <Typography variant='subtitle1' gutterBottom style={{marginTop: '16px'}}>{value}</Typography>
                                                    </FormControl>
                                                )}
                                            />  
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='vatIdCode'
                                                control={control}
                                                render={({ field: { value }, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>                          
                                                        <InputLabel shrink>
                                                            {t('VatID')}
                                                        </InputLabel>
                                                        <Typography variant='subtitle1' gutterBottom style={{marginTop: '16px'}}>{value}</Typography>
                                                    </FormControl>
                                                )}
                                            />  
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='taxIdCode'
                                                control={control}
                                                render={({ field: { value }, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>                          
                                                        <InputLabel shrink>
                                                            {t('TaxID')}
                                                        </InputLabel>
                                                        <Typography variant='subtitle1' gutterBottom style={{marginTop: '16px'}}>{value}</Typography>
                                                    </FormControl>
                                                )}
                                            />  
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Controller
                                                name='companyIdCode'
                                                control={control}
                                                render={({ field: { value }, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>                          
                                                        <InputLabel shrink>
                                                            {t('CompanyIdCode')}
                                                        </InputLabel>
                                                        <Typography variant='subtitle1' gutterBottom style={{marginTop: '16px'}}>{value}</Typography>
                                                    </FormControl>
                                                )}
                                            />  
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='businessLicense'
                                                control={control}
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>                          
                                                        <InputLabel shrink>
                                                            {t('BusinessLicense')}
                                                        </InputLabel>
                                                        <Typography variant='subtitle1' gutterBottom style={{marginTop: '16px'}}>{businessLicense ? businessLicense.name : ''}</Typography>
                                                    </FormControl>
                                                )}
                                            />  
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name='officialDocument'
                                                control={control}
                                                render={({ field, fieldState: { error } }) => (
                                                    <FormControl fullWidth error={!!error}>                          
                                                        <InputLabel shrink>
                                                            {t('OfficialDocument')}
                                                        </InputLabel>
                                                        <Typography variant='subtitle1' gutterBottom style={{marginTop: '16px'}}>{officialDocument ? officialDocument.name : ''}</Typography>
                                                    </FormControl>
                                                )}
                                            />  
                                        </Grid>
                                    </Grid>
                                    <Box display='flex' justifyContent={"space-between"} pt={1}>
                                        <Button
                                            variant='contained'
                                            component={RouterLink}
                                            to='/signup/license'
                                            style={{ marginLeft: 8 }}>
                                            {t('Back')}
                                        </Button>
                                        
                                        {loading && <Loader my={0} />}
        
                                        <Button 
                                            type='submit' 
                                            variant='contained' 
                                            style={{
                                                color: "#fff",
                                                backgroundColor:'#D30808'}}>
                                            {t('Next')}
                                        </Button>
                                    </Box>
                                </form>
                            </FormProvider>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
};

export default SignupSubmitScreen;