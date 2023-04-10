import * as React from 'react';
import {
    BooleanField,
    BulkDeleteWithConfirmButton,
    BulkExportButton,
    Datagrid,
    DateField,
    DateInput,
    EmailField,
    List,
    NullableBooleanInput,
    ReferenceField,
    SearchInput,
    TextField,
    WrapperField
} from 'react-admin';
import { useMediaQuery, Theme } from '@mui/material';
import FullNameField from '../components/user/FullNameField';
import AddressField from '../components/user/AddressField';
import UserListAside from './users.list.aside';
import UserListMobileGrid from './users.list.mobile';
import DownloadLicenseZip from '../components/user/DownloadLicenseZip';

const userFilters = [
    <SearchInput source='q' alwaysOn />,
    <DateInput source='last_seen_gte' />,
    <NullableBooleanInput source='userVerified' />,
    <NullableBooleanInput source='userFreezed' />,
];

const UserBulkActionButtons = React.memo(({ children, ...props }) => (
    <React.Fragment>
        <DownloadLicenseZip {...props} />
        {/* default bulk delete action */}
        <BulkExportButton {...props} />
        <BulkDeleteWithConfirmButton mutationMode='optimistic' confirmTitle={'pos.bulk.delete.title'} confirmContent={'pos.bulk.delete.content'} {...props} />
    </React.Fragment>
));

const UserList = () => {
    const isXsmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));

    return (
        <List
            filters={isSmall ? userFilters : undefined}
            sort={{ field: 'lastSeen', order: 'DESC' }}
            perPage={25}
            aside={<UserListAside />}>
            {isXsmall ? (
                <UserListMobileGrid />
            ) : (
                <Datagrid
                    optimized
                    bulkActionButtons={<UserBulkActionButtons />}
                    rowClick='show'
                    sx={{
                        '& .column-groups': {
                            md: { display: 'none' },
                            lg: { display: 'table-cell' },
                        },
                    }}>
                    <EmailField source="email" label="resources.users.fields.email" />
                    <WrapperField label="resources.users.fields.name" sortBy='nameLast'>
                        <FullNameField />
                    </WrapperField>
                    <TextField source="companyName" label="resources.users.fields.company_name" />
                    <TextField source="phoneNumber" label="resources.users.fields.phone_number" />
                    <TextField source="taxIdCode" label="resources.users.fields.tax_id_code" />
                    <WrapperField label="resources.users.fields.address" sortBy='addressCity'>
                        <AddressField />
                    </WrapperField>
                    {/* <WrapperField label="resources.users.fields.license_state">
                        <TextField label="resources.users.fields.business_license_state" source="businessLicenseState" />
                        <TextField label="resources.users.fields.business_license_state" source="officialDocumentState" />
                    </WrapperField> */}
                    <BooleanField source="userVerified" label="resources.users.fields.user_verified" />
                    <TextField source="editBy" label="pos.common.edit_by" />
                    <DateField source="lastSeen" label="resources.users.fields.last_seen" showTime locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                </Datagrid>
            )}
        </List>
    );
}

export default UserList;