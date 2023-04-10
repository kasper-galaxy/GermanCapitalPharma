import { Box, Grid, Typography } from '@mui/material';
import * as React from 'react';
import { defaultTheme } from 'react-admin';
import { BooleanField, DateField, EmailField, FileField, NumberField, ReferenceField, Show, SimpleShowLayout, TextField, useRecordContext, useTranslate, WrapperField } from 'react-admin';
import LicenseStateField from '../components/user/LicenseStateField';
import OfficialNameField from '../components/user/OfficialNameField';
import SendMailButton from '../components/user/SendMailButton';
import SirTitleField from '../components/user/SirTitleField';
import { ADMIN_ACTION_SEND_MAIL_CHECK_EMAIL, ADMIN_ACTION_SEND_MAIL_PROXY_PASSWORD } from '../constants/ActionMsg';

const theme = {
    ...defaultTheme,
    
};

const UserTitle = () => {
    const record = useRecordContext();
    return <span>{record ? `${record.nameFirst} ${record.nameLast}` : ''}</span>;
};

const UserShow = () => {
    const translate = useTranslate();

    return (
        <Show title={<UserTitle />}>
            <SimpleShowLayout>
                <Grid container width={{ xs: '100%', xl: '100%' }} spacing={8}>
                    <Grid item xs={12} md={3}>
                        <SectionTitle label='resources.users.field_groups.identity' />
                            <SimpleShowLayout>
                                <WrapperField label="resources.users.fields.name" >
                                    {/* <TextField source="nameSirCode" /> {' '}
                                    <TextField source="nameSirTitle" />{record && record.nameSirTitle.length > 0 ? '. ' : ' '}
                                    <TextField source="nameFirst" /> {' '}
                                    <TextField source="nameLast" /> */}
                                    <OfficialNameField />
                                </WrapperField>
                                <EmailField source="email" label="resources.users.fields.email" />
                                <EmailField source="invoiceEmail" label="resources.users.fields.invoice_email" />

                            </SimpleShowLayout>                        
                            <Separator />

                            <SectionTitle label='resources.users.field_groups.address' />
                            <SimpleShowLayout>
                                <WrapperField label="resources.users.fields.address" >
                                    <TextField source="addressStreet" />{' '}
                                    <TextField source="addressHouse" />{', '}
                                    <TextField source="addressZipCode" />{' '}
                                    <TextField source="addressCity" />
                                </WrapperField>
                                <Separator />

                                <TextField source="phoneNumber" label="resources.users.fields.phone_number"  />
                                <TextField source="faxNumber" label="resources.users.fields.fax_number"  />

                            </SimpleShowLayout>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <SectionTitle label='resources.users.field_groups.company' />
                        <SimpleShowLayout>
                            <TextField source="companyName" label="resources.users.fields.company_name"  />
                            <TextField source="corporationForm" label="resources.users.fields.corporation_form" />
                            <TextField source="companyIdCode" label="resources.users.fields.company_id_code"  />
                            <TextField source="vatIdCode" label="resources.users.fields.vat_id_code"  />
                            <TextField source="taxIdCode" label="resources.users.fields.tax_id_code"  />
                        </SimpleShowLayout>                    
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <SectionTitle label='resources.users.field_groups.license' />
                        <SimpleShowLayout>
                            <FileField source="businessLicense.url" title={translate('resources.users.actions.document_open')} target="_blank" label='resources.users.fields.business_license'  />
                            {/* <TextField source="businessLicenseState" label="resources.users.fields.business_license_state"  /> <Separator /> */}
                            <LicenseStateField source="businessLicenseState" label="resources.users.fields.business_license_state"/> <Separator />

                            <FileField source="officialDocument.url" title={translate('resources.users.actions.document_open')} target="_blank" label='resources.users.fields.official_document'  />
                            {/* <TextField source="officialDocumentState" label="resources.users.fields.official_document_state"  /> <Separator /> */}
                            <LicenseStateField source="officialDocumentState" label="resources.users.fields.official_document_state" /> <Separator />

                            <FileField source="additionalDocument" src='url' title="title" target="_blank" label='resources.users.fields.additional_document' />
                            <Separator />
                        </SimpleShowLayout>

                        <SectionTitle label='resources.users.field_groups.action' />
                        <SendMailButton 
                            label='resources.users.actions.send_mail_check_email'
                            type={ADMIN_ACTION_SEND_MAIL_CHECK_EMAIL} />
                        <SendMailButton 
                            label='resources.users.actions.send_mail_proxy_password_email'
                            type={ADMIN_ACTION_SEND_MAIL_PROXY_PASSWORD} />
                        <Separator />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <SectionTitle label='resources.users.field_groups.state' />
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <SimpleShowLayout>
                                    <BooleanField source="emailConfirmed" label="resources.users.fields.email_confirmed"  />
                                </SimpleShowLayout>
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <SimpleShowLayout>
                                    <BooleanField source="userVerified" label="resources.users.fields.user_verified"  />
                                </SimpleShowLayout>
                            </Box>
                        </Box>
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <SimpleShowLayout>
                                    <BooleanField source="userProxy" label="resources.users.fields.user_proxy"  />
                                </SimpleShowLayout>
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <SimpleShowLayout>
                                    {/* <BooleanField source="isAdmin" label="resources.users.fields.is_admin"  /> */}
                                </SimpleShowLayout>
                            </Box>
                        </Box>
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <SimpleShowLayout>
                                    <BooleanField source="editionBlocked" label="resources.users.fields.edition_blocked"  />
                                </SimpleShowLayout>
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <SimpleShowLayout>
                                    <BooleanField source="userFreezed" label="resources.users.fields.user_freezed"  />
                                </SimpleShowLayout>
                            </Box>
                        </Box>
                        {/* <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <SimpleShowLayout>
                                    <NumberField source="wrongPasswordCount" label="resources.users.fields.wrong_password_count"  />
                                </SimpleShowLayout>
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <SimpleShowLayout>
                                    <NumberField source="editionCount" label="resources.users.fields.edition_count"  />
                                </SimpleShowLayout>
                            </Box>
                        </Box> */}
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <SimpleShowLayout>
                                    <DateField source="createdAt" label="resources.users.fields.first_seen" locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                                </SimpleShowLayout>
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <SimpleShowLayout>
                                    <DateField source="lastSeen" label="resources.users.fields.last_seen" locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                                </SimpleShowLayout>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </SimpleShowLayout>
        </Show>
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

export default UserShow;