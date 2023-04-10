import * as React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { BooleanInput, Create, DateInput, NumberInput, PasswordInput, required, SimpleForm, TextInput, useTranslate, minLength, maxLength, regex, email, number, FileInput, FileField, useNotify, useRedirect, useRefresh } from 'react-admin';
import CorporationFormInput from '../components/user/CorporationFormInput';
import UserSirCodeKeyInput from '../components/user/UserSirCodeKeyInput';
import CorporationFormConst from '../constants/SelectFields/CorporationForm';
import SirCodeConst from '../constants/SelectFields/SirCode';
import validator from 'validator';
import { ERROR_INVALID_USERDATA, ERROR_USER_ALREADY_EXIST } from '../constants/ErrorMsg';


const isValidPhoneNumber = (message = 'resources.users.errors.phone_number_not_valid') =>
    (value: any) => value && validator.isMobilePhone(value) ? message : undefined;
const isValidTaxIdCode = (message = 'resources.users.errors.tax_id_code_not_valid') =>
    (value: any) => value && validator.isTaxID(value) ? message : undefined;

const validateNameFirst = [required(), minLength(2), maxLength(15)];
const validateNameLast = [required(), minLength(2), maxLength(15)];
const validateNameSirCode = [required()];
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
// const validatePasswordMatch = (value: String, allValues: Record<string, any>) => {
//     if (value !== allValues.confirm_password)
//         return 'resources.users.errors.password_mismatch'
//     return undefined;
// };
const validatePassword = [required(), minLength(6)];
const validateConfirmPasswordMatch = (value: String, allValues: Record<string, any>) => {
    if (value !== allValues.password)
        return 'resources.users.errors.password_mismatch'
    return undefined;
};
const validateConfirmPassword = [required(), minLength(6), validateConfirmPasswordMatch];
const validateBusinessFile = [required()];

const UserCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const translate = useTranslate();
    const refresh = useRefresh();
    SirCodeConst[0].id = translate(SirCodeConst[0].name);
    SirCodeConst[1].id = translate(SirCodeConst[1].name);

    const onError = (error: any) => {
        // let errMsg = '';
        // switch (error.message) {
        //     case ERROR_USER_ALREADY_EXIST:
        //         errMsg = `resources.users.errors.user_already_exist`;
        //         break;
        //     case ERROR_INVALID_USERDATA:
        //         errMsg = 'resources.users.errors.invalid_user_data';
        //         break;
        //     default:
        //         errMsg = 'resources.users.errors.create_user_error';
        //         break;
        // }
        notify(error.message, { type: 'error' });
    }

    const onSuccess = (data: any) => {
        console.log('success ', data);
        redirect(`/users/${data.id}/show`);
        // refresh();
    }

    return (
        <Create mutationOptions={{ onError, onSuccess }} redirect="show">
            <SimpleForm
                defaultValues={{
                    companyName: '',
                    corporationForm: translate(CorporationFormConst[0].name),
                    email: 'yourmail@pharma.de',
                    nameSirCode: translate(SirCodeConst[0].name),
                    nameSirTitle: '',
                    nameFirst: '',
                    nameLast: '',
                    addressStreet: '',
                    addressHouse: '',
                    addressZipCode: '',
                    addressCity: '',
                    phoneNumber: '+49',
                    faxNumber: '+49',
                    vatIdCode: '',
                    taxIdCode: '',
                    companyIdCode: '',
                }}
            >
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
                                <UserSirCodeKeyInput 
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

                        {/* <SectionTitle label='resources.users.field_groups.set_password' />
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <PasswordInput 
                                    source='password'
                                    validate={validatePassword}
                                    fullWidth
                                    label={translate(
                                        'resources.users.fields.password'
                                    )}/>
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <PasswordInput 
                                    source='confirm_password'
                                    validate={validateConfirmPassword}
                                    fullWidth
                                    label={translate(
                                        'resources.users.fields.confirm_password'
                                    )}/>
                            </Box>
                        </Box> */}
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
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <SectionTitle label='resources.users.field_groups.license' />
                        <FileInput
                            source="businessLicense"
                            label="resources.users.fields.business_license_required"
                            accept=".pdf,.png,.jpg"
                            maxSize={10000000}
                        >
                            <FileField source="businessLicense" title="resources.users.fields.business_license" target="_blank" />
                        </FileInput>

                        <FileInput
                            source="officialDocument"
                            label="resources.users.fields.official_document"
                            accept=".pdf,.png,.jpg"
                            maxSize={10000000}
                        >
                            <FileField source="officialDocument" title="resources.users.fields.official_document" target="_blank"/>
                        </FileInput>

                        <SectionTitle label='resources.users.field_groups.other' />
                        <FileInput
                            source="additionalDocument"
                            label="resources.users.fields.additional_document"
                            accept=".pdf,.png,.jpg"
                            maxSize={10000000}
                            multiple
                        >
                            <FileField source="additionalDocumentSrc" title="additionalDocumentTitle" src="url" target="_blank"/>
                        </FileInput>
                        <Separator />
                        <Separator />
                    </Grid>
                </Grid>
            </SimpleForm>
        </Create>
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

export default UserCreate;