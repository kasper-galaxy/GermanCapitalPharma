import * as React from 'react';
import { BooleanInput, DateInput, Edit, email, FileField, FileInput, maxLength, minLength, NumberInput, PasswordInput, ReferenceInput, regex, required, SelectInput, SimpleForm, TextInput, useNotify, useRecordContext, useRedirect, useRefresh, useTranslate, TopToolbar, ShowButton, Toolbar, SaveButton, DeleteButton } from 'react-admin';
import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import CorporationFormInput from '../components/user/CorporationFormInput';
import UserSirCodeInput from '../components/user/UserSirCodeInput';
import validator from 'validator';
import CancelIcon from '@mui/icons-material/Cancel';
import { 
    KEY_LICENSE_DOCUMENT_APPROVED,
    KEY_LICENSE_DOCUMENT_REJECTED,
    KEY_LICENSE_DOCUMENT_UPLOADED,
    KEY_LICENSE_DOCUMENT_NOTUPLOADED
 } from '../constants/SelectFields/LicenseStatusKey';
import UserVerifiedInput from '../components/user/UserVerifiedInput';
import LicenseStateInput from '../components/user/LicenseStateInput';
import { User } from '../types';

const UserTitle = () => {
    const record = useRecordContext();
    return <span>{record ? `${record.nameFirst} ${record.nameLast}` : ''}</span>;
};

const isValidPhoneNumber = (message = 'resources.users.errors.phone_number_not_valid') =>
    (value: any) => value && validator.isMobilePhone(value) ? message : undefined;
const isValidTaxIdCode = (message = 'resources.users.errors.tax_id_code_not_valid') =>
    (value: any) => value && validator.isTaxID(value) ? message : undefined;


const validateNameFirst = [required(), minLength(2), maxLength(15)];
const validateNameLast = [required(), minLength(2), maxLength(15)];
const validateNameSirCode = [required()];
// const validateLicenseApproveWithEmailConfirmation = (value: String, allValues: Record<string, any>) => {
//     if (value ===  && !allValues.emailConfirmed)
//         return 'resources.users.errors.password_mismatch'
//     return undefined;
// };
const validateLicenseState = [required()];
const validateEmailRequired = [required(), email()];
const validateEmail = [email()];
const validatePhoneNumber = [required(), minLength(8), isValidPhoneNumber()];
const validateFaxNumber = [required(), minLength(8), isValidPhoneNumber()];
const validateAddressStreet = [required()];
const validateAddressHouse = [required()];
const validateAddressZipCode = [required(), regex(/^\d{5}$/, 'resources.users.errors.zipcode_not_valid')];
const validateAddressCity = [required()];
const validateCompanyName = [required()];
const validateCorporationForm = [required()];
const validateCompanyIdCode = [required()];
const validateVatTaxCode = [required(), isValidTaxIdCode()];
const validatePassword = [minLength(6)];
const validateConfirmPasswordMatch = (value: String, allValues: Record<string, any>) => {
    if (value !== allValues.password)
        return 'resources.users.errors.password_mismatch'
    return undefined;
};
const validateConfirmPassword = [minLength(6), validateConfirmPasswordMatch];

const validateBusinessLicenseStateCorrect = (value: String, allValues: Record<string, any>) => {
    console.log('business license ', value, allValues);

    if (!allValues.businessLicense) {
        return 'resources.users.errors.no_business_license';
    }
    if (value == KEY_LICENSE_DOCUMENT_APPROVED) {
        if (!allValues.emailConfirmed && !allValues.userProxy) {
            return 'resources.users.errors.no_approval_without_email_confirmation';
        }
    }
    if (value === KEY_LICENSE_DOCUMENT_NOTUPLOADED) {
        return 'resources.users.errors.no_business_license_state';
    }
    
    return undefined;
};
const validateBusinessLicenseState = [required(), validateBusinessLicenseStateCorrect];

const validateOfficialeDocumentStatCorrect = (value: String, allValues: Record<string, any>) => {
    console.log('official validation ', value, allValues);

    if (!allValues.officialDocument) {
        if (value === KEY_LICENSE_DOCUMENT_APPROVED ||
            value === KEY_LICENSE_DOCUMENT_REJECTED ||
            value === KEY_LICENSE_DOCUMENT_UPLOADED)
        return 'resources.users.errors.action_without_license'
    } else {
        if (value == KEY_LICENSE_DOCUMENT_APPROVED) {
            if (!allValues.emailConfirmed && !allValues.userProxy) {
                return 'resources.users.errors.no_approval_without_email_confirmation';
            }
        }
        if (value === KEY_LICENSE_DOCUMENT_NOTUPLOADED) {
            return 'resources.users.errors.no_official_document_state'
        }
    }
    return undefined;
};
const validateOfficialDocumentState = [required(), validateOfficialeDocumentStatCorrect];

const UserEditActions = () => (
    <TopToolbar>
        <ShowButton 
            icon={<CancelIcon />}
            label='resources.users.actions.cancel'/>
    </TopToolbar>
);

const MyToolbar = ({...props}) => {
    const record = useRecordContext<User>();

    return (
        <Toolbar {...props}>
            <Box flex={1} display={{ xs: 'block', sm: 'flex' }} justifyContent={'space-between'} >
                <SaveButton alwaysEnable />
                <DeleteButton confirmTitle={`Lösche benutzer "${record.nameFirst + ' ' + record.nameLast}"`} />
            </Box>
        </Toolbar>
    );
};

const UserEdit = ({...props}) => {
    const notify = useNotify();
    const translate = useTranslate();
    const redirect = useRedirect();
    const refresh = useRefresh();

    console.log('useredit ', props);
    
    const onError = (error: any) => {
        // let errMsg = '';
        // switch (error.message) {
        //     case ERROR_INVALID_USERDATA:
        //         errMsg = 'resources.users.errors.invalid_user_data';
        //         break;
        //     case ERROR_NO_UPLOAD_BUSINESS_LICENSE:
        //         errMsg = 'resources.users.errors.no_business_license';
        //         break;
        //     case ERROR_USER_ALREADY_EXIST:
        //         errMsg = 'resources.users.errors.user_already_exist';
        //         break;
        //     default:
        //         errMsg = 'resources.users.errors.update_user_error';
        //         break;
        // }
        notify(error.message, { type: 'error' });
    }

    const onSuccess = (data: any) => {
        console.log('success ', data);
        redirect(`/users/${data.id}/show`);
        refresh();
    }
    
    // const userVerifiedOnChange = (checked: Boolean) => {
    //     const params = { 
    //         id: record.id, 
    //         data: { userVerified: checked },
    //     }
    //     const { mutate, isLoading, isSuccess, isError } = useMutation(
    //         [
    //             'sendMailToUser', 'users',
    //             params
    //         ],
    //         () => dataProvider.sendUserVerified('users', params)
    //     );

    //     mutate();
    // }

    return (
        <Edit title={<UserTitle />} mutationOptions={{ onError, onSuccess }} mutationMode='pessimistic' actions={<UserEditActions />} >
            <SimpleForm toolbar={<MyToolbar />}>
                <Grid container width={{ xs: '100%', xl: '100%' }} spacing={8}>
                    <Grid item xs={12} md={6}>
                        
                        <SectionTitle label='resources.users.field_groups.identity' />
                        <Box display={{ xs: 'block', sm: 'flex', width: '100%' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <TextInput 
                                    autoFocus
                                    source='nameFirst'
                                    validate={validateNameFirst}
                                    fullWidth
                                    label={translate(
                                        'resources.users.fields.name_first'
                                    )}/>
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <TextInput 
                                    source='nameLast'
                                    validate={validateNameLast}
                                    fullWidth
                                    label={translate(
                                        'resources.users.fields.name_last'
                                    )}/>
                            </Box>
                        </Box>
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <UserSirCodeInput 
                                    source='nameSirCode'
                                    validate={validateNameSirCode}
                                    fullWidth
                                    label={translate(
                                        'resources.users.fields.name_sir_code'
                                    )}/>
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <TextInput 
                                    source='nameSirTitle'
                                    fullWidth
                                    label={translate(
                                        'resources.users.fields.name_sir_title'
                                    )}/>
                            </Box>
                        </Box>
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <TextInput type="email" source="email" validate={validateEmailRequired} fullWidth />
                            </Box>
                        </Box>
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <TextInput type="email" source="invoiceEmail" validate={validateEmail} fullWidth />
                            </Box>
                        </Box>
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <TextInput 
                                    source='phoneNumber'
                                    validate={validatePhoneNumber}
                                    fullWidth
                                    label={translate(
                                        'resources.users.fields.phone_number'
                                    )}/>
                                    {/* <PhoneInputField 
                                        source='phoneNumber'
                                        label={translate(
                                            'resources.users.fields.phone_number'
                                        )}/> */}
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <TextInput 
                                    source='faxNumber'
                                    validate={validateFaxNumber}
                                    fullWidth
                                    label={translate(
                                        'resources.users.fields.fax_number'
                                    )}/>
                                {/* <PhoneInputField 
                                    source='faxNumber'
                                    label={translate(
                                        'resources.users.fields.fax_number'
                                    )}/> */}
                            </Box>
                        </Box>
                        <Separator />

                        <SectionTitle label='resources.users.field_groups.address' />
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <TextInput 
                                    source='addressStreet'
                                    validate={validateAddressStreet}
                                    fullWidth
                                    label={translate(
                                        'resources.users.fields.address_street'
                                    )}/>
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <TextInput 
                                    source='addressHouse'
                                    validate={validateAddressHouse}
                                    fullWidth
                                    label={translate(
                                        'resources.users.fields.address_house'
                                    )}/>
                            </Box>
                        </Box>
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <TextInput 
                                    source='addressZipCode'
                                    validate={validateAddressZipCode}
                                    fullWidth
                                    label={translate(
                                        'resources.users.fields.address_zipcode'
                                    )}/>
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <TextInput 
                                    source='addressCity'
                                    validate={validateAddressCity}
                                    fullWidth
                                    label={translate(
                                        'resources.users.fields.address_city'
                                    )}/>
                            </Box>
                        </Box>

                        <SectionTitle label='resources.users.field_groups.set_password' />
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <PasswordInput 
                                    source='password'
                                    validate={validatePassword}
                                    fullWidth
                                    label={translate(
                                        'resources.users.fields.password'
                                    )}/>
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <PasswordInput 
                                    source='password'
                                    validate={validateConfirmPassword}
                                    fullWidth
                                    label={translate(
                                        'resources.users.fields.confirm_password'
                                    )}/>
                            </Box>
                        </Box>
                    </Grid>                
                    <Grid item xs={12} md={3}>
                        <SectionTitle label='resources.users.field_groups.company' />
                        <TextInput
                            source="companyName"
                            validate={validateCompanyName}
                            fullWidth
                            label={translate(
                                "resources.users.fields.company_name"
                            )}
                        />
                        <TextInput
                            source="companyIdCode"
                            validate={validateCompanyIdCode}
                            fullWidth
                            label={translate(
                                "resources.users.fields.company_id_code"
                            )}
                        />
                        <CorporationFormInput 
                            source='corporationForm'
                            validate={validateCorporationForm}
                            fullWidth
                            label={translate(
                                "resources.users.fields.corporation_form"
                            )}/>
                        <TextInput
                            source="vatIdCode"
                            fullWidth
                            label={translate(
                                "resources.users.fields.vat_id_code"
                            )}
                        />
                        <TextInput
                            source="taxIdCode"
                            validate={validateVatTaxCode}
                            fullWidth
                            label={translate(
                                "resources.users.fields.tax_id_code"
                            )}
                        />
                        <Separator />
                        
                        <SectionTitle label='resources.users.field_groups.state' />
                        <BooleanInput 
                            source="emailConfirmed"
                            fullWidth
                            disabled
                            label={translate(
                                "resources.users.fields.email_confirmed"
                            )} />
                        <BooleanInput 
                            source="userVerified"
                            fullWidth
                            disabled
                            label={translate(
                                "resources.users.fields.user_verified"
                            )} />
                        <BooleanInput 
                            source="editionBlocked" 
                            fullWidth
                            label={translate(
                                "resources.users.fields.edition_blocked"
                            )}/>
                        <BooleanInput 
                            source="userFreezed" 
                            fullWidth
                            label={translate(
                                "resources.users.fields.user_freezed"
                            )}/>
                        <UserVerifiedInput 
                            source="userVerified" 
                            fullWidth
                            label={translate(
                                "resources.users.fields.user_verified"
                            )}/>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <SectionTitle label='resources.users.field_groups.license' />
                        <FileInput
                            source="businessLicense"
                            label="resources.users.fields.business_license_required"
                            accept=".pdf,.png,.jpg"
                            maxSize={10000000}
                        >
                            <FileField source="url" title="title" src="url" target="_blank"  />
                        </FileInput>
                        <Separator />
                        <LicenseStateInput
                            source='businessLicenseState'
                            fullWidth
                            validate={validateBusinessLicenseState}
                            label={translate(
                                'resources.users.fields.business_license_state'
                            )}/>
                        <Separator />

                        <FileInput
                            source="officialDocument"
                            label="resources.users.fields.official_document"
                            accept=".pdf,.png,.jpg"
                            maxSize={10000000}
                        >
                            <FileField source="url" title="title" src="url" target="_blank"/>
                        </FileInput>
                        <Separator />
                        <LicenseStateInput 
                            source='officialDocumentState'
                            fullWidth
                            validate={validateOfficialDocumentState}
                            label={translate(
                                'resources.users.fields.official_document_state'
                            )}/>
                        <Separator />
                        
                        <FileInput
                            source="additionalDocument"
                            label="resources.users.fields.additional_document"
                            accept=".pdf,.png,.jpg"
                            maxSize={10000000}
                            multiple
                        >
                            <FileField source="url" title="title" src="url" target="_blank"/>
                        </FileInput>
                        <Separator />

                        <Separator />
                        <Separator />
                    </Grid>
                </Grid>
            </SimpleForm>
        </Edit>
    );
};

const SectionTitle = ({ label }: { label: string }) => {
    const translate = useTranslate();

    return (
        <Typography variant="h6" gutterBottom>
            {translate(label as string)}
        </Typography>
    );
};

const Separator = () => <Box pt="1.5em" />;

export default UserEdit;