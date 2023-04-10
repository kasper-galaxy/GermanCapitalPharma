import React, { useEffect, useState } from 'react';
import { Breadcrumbs, Container, Grid, makeStyles, Link, Box, Paper, Typography, FormControl, Button, FormLabel, FormHelperText } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Meta from '../components/Meta';
import SignupSteps from '../components/Step/SignupSteps';
import InputController from '../components/InputController';
import { COLOR_BUTTON_PRIMARY_BACKGROUND, COLOR_WHITE } from '../constants/color.constants';
import Message from '../components/Message';
import { useDispatch, useSelector } from 'react-redux';
import { USER_SET_LICENSE } from '../constants/user.constant';

const useStyles = makeStyles((theme) => ({
    breadcrumbsContainer: {
        ...theme.mixins.customize.breadcrumbs,
    },
    form: {
        '& > *': {
            marginBottom: 16,
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

const SignupLicenseScreen = ({ history }) => {
    const classes = useStyles();
    const methods = useForm();
    const dispatch = useDispatch();
    const { handleSubmit, setValue } = methods;
    const { t } = useTranslation();
    const { documents } = useSelector((state) => state.userLicense); 

    let regData = localStorage.getItem('reg_profile');
    if (regData) {
        regData = JSON.parse(regData);
    } else {
        history.push('/signup/profile');
    }

    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [businessLicense, setBusinessLicense] = useState(false);
    const [officialDocument, setOfficialDocument] = useState(false);
    const [businessLicenseValid, setBusinessLicenseValid] = useState(false);

    const onBusinessLicenseFileChange = evt => {
        const file = evt.target.files[0];
        let business = null;
        if (file && file.size < 1024 * 1024 *10) {
            setValue('businessLicense', file.name);
            regData = JSON.parse(localStorage.getItem('reg_profile'));
            regData['businessLicense'] = file.name;
            localStorage.setItem('reg_profile', JSON.stringify(regData));
            business = file;
            setBusinessLicenseValid(true);
            setUploadSuccess(true);
            setBusinessLicense(file);
            setTimeout(() => { setUploadSuccess(false) }, 3000);
        } else {
            setBusinessLicenseValid(false);
        }
        console.log('business ', business, officialDocument);
        dispatch({
            type: USER_SET_LICENSE,
            payload: {
                businessLicense: business,
                officialDocument
            }
        });
    }

    const onOfficialDocumentFileChange = evt => {
        const file = evt.target.files[0];
        let official = null;
        if (file && file.size < 1024 * 1024 *10) {
            setValue('officialDocument', file.name);
            regData = JSON.parse(localStorage.getItem('reg_profile'));
            regData['officialDocument'] = file.name;
            localStorage.setItem('reg_profile', JSON.stringify(regData));
            official = file;
            setUploadSuccess(true);
            setOfficialDocument(file);
            setTimeout(() => { setUploadSuccess(false) }, 3000);
        }

        console.log('official ', businessLicense, official);
        dispatch({
            type: USER_SET_LICENSE,
            payload: {
                businessLicense,
                officialDocument: official
            }
        });
    }

    useEffect(() => {
        if (regData) {
            setValue('businessLicense', regData.businessLicense || '');
            setValue('officialDocument', regData.officialDocument || '');
        }
    }, []);

    useEffect(() => {
        if (documents) {
            console.log(documents);
            if (documents.businessLicense) {
                setBusinessLicenseValid(true);
                setBusinessLicense(documents.businessLicense);
            }
            if (documents.officialDocument) {
                setOfficialDocument(documents.officialDocument);
            }
        }
    }, [ documents ]);

    const onSubmit = () => {
        if (businessLicenseValid) {
            dispatch({
                type: USER_SET_LICENSE,
                payload: {
                    businessLicense,
                    officialDocument
                }
            });
            history.push('/signup/submit');
        }
    };

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
                        <Link color='textPrimary' underline='none'>
                            {t('SignupUploadDocuments')}
                        </Link>
                    </Breadcrumbs>
                    <SignupSteps step={1} />
                </Grid>
            </Grid>
            <Box className={classes.boxContainer}>
                <Paper elevation={0} className={classes.content} square>
                    <Grid container spacing={8}>
                        <Grid item sm={12}>
                            <Typography variant='h5' gutterBottom>
                                {t('SignupUploadDocuments')}
                            </Typography>
                            <Typography variant='subtitle1' gutterBottom>
                                {t('SignupLicenseInstructionText')}
                            </Typography>
                            <br />
                            <FormProvider id='uploadLicenseForm' {...methods}>
                                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={8}>
                                            <FormControl fullWidth>
                                                <InputController name='businessLicense' label={t('BusinessLicense')} InputProps={{ readOnly: true }} />
                                                {!businessLicenseValid && (
                                                    <FormHelperText error>{t('DocumentFieldRequired')}</FormHelperText>
                                                )}
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
                                                        onChange={onBusinessLicenseFileChange} />
                                                    <Button
                                                        style={{
                                                            color: COLOR_WHITE,
                                                            backgroundColor: COLOR_BUTTON_PRIMARY_BACKGROUND
                                                        }}
                                                        variant='contained' component='span' >
                                                        {t('Upload')}
                                                    </Button>
                                                </label>
                                            </Box>
                                            <br />
                                        </Grid>
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
                                                        onChange={onOfficialDocumentFileChange} />
                                                    <Button
                                                        style={{
                                                            color: COLOR_WHITE,
                                                            backgroundColor: COLOR_BUTTON_PRIMARY_BACKGROUND
                                                        }}
                                                        variant='contained' component='span' >
                                                        {t('Upload')}
                                                    </Button>
                                                </label>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <FormLabel htmlFor='uploadLicenseForm'>
                                        {t('UploadLicenseLabel')}
                                    </FormLabel>  <br /><br />

                                    <Grid container spacing={2}>
                                        {uploadSuccess &&
                                            <Grid item xs={12}>
                                                <Message severity='success' mt={8}>
                                                    {t('UploadedSucessful')}
                                                </Message>
                                            </Grid>}
                                        <Grid item xs={12} sm={10}>
                                            <Box display='flex' justifyContent={"space-between"} pt={1}>
                                                <Button 
                                                    variant='contained'
                                                    component={RouterLink}
                                                    to='/signup/profile'
                                                    style={{ marginLeft: 8 }}>
                                                    {t('Back')}
                                                </Button>
                                                <Button 
                                                    type='submit'
                                                    variant='contained'
                                                    style={{
                                                        color: COLOR_WHITE,
                                                        backgroundColor: COLOR_BUTTON_PRIMARY_BACKGROUND
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

export default SignupLicenseScreen;