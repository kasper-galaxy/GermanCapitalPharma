import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { useNotify, useRecordContext, useRefresh, useTranslate } from 'react-admin';
import { User } from '../../types';
import { useMutation } from 'react-query';
import myDataProvider from '../../dataProvider/myDataProvider';
import config from '../../config';
import { KEY_LICENSE_DOCUMENT_APPROVED, KEY_LICENSE_DOCUMENT_REJECTED } from '../../constants/SelectFields/LicenseStatusKey';
import { Check, Refresh } from '@mui/icons-material';

const BusinessLicenseStateInput = ({ ...props }) => {
    console.log('user busines license btn');
    const { source } = props;
    const translate = useTranslate();
    const notify = useNotify();
    const refresh = useRefresh();

    const record = useRecordContext<User>();
    const dataProvider = myDataProvider(config.API_URL);

    const params = {
        id: record.id, 
        data: { businessLicenseState: record.businessLicenseState === KEY_LICENSE_DOCUMENT_APPROVED ? KEY_LICENSE_DOCUMENT_REJECTED : KEY_LICENSE_DOCUMENT_APPROVED },
    };

    const { mutate, isLoading, isSuccess, isError } = useMutation(
        [
            'sendBusinessLicenseState', 'users',
            params
        ],
        () => dataProvider.sendBusinessLicenseState('users', params)
    );

    React.useEffect(() => {
        if (isError) {
            notify('resources.users.messages.operation_failed', {
                type: 'error',
            });
        }
        if (isSuccess) {
            notify('resources.users.messages.operation_success', {
                type: 'success',
            });
            refresh();
        }
    }, [isSuccess, isError]);

    return record.businessLicenseState === KEY_LICENSE_DOCUMENT_APPROVED ? (
        <Button
            variant="outlined"
            color="error"
            size="medium"
            onClick={() => mutate()}
            fullWidth
            startIcon={<Refresh sx={{ color: 'red' }} />}
            disabled={isLoading}
        >
            {translate('resources.users.actions.license_reject')}
        </Button>
    ) : (
        <Button
            variant="outlined"
            color="success"
            size="medium"
            onClick={() => mutate()}
            fullWidth
            startIcon={<Check sx={{ color: 'green' }} />}
            disabled={isLoading}
        >
            {translate('resources.users.actions.license_approve')}
        </Button>
    );
}

BusinessLicenseStateInput.propTypes = {
    record: PropTypes.any,
    source: PropTypes.string
};

export default BusinessLicenseStateInput;
// import { SelectInput, SelectInputProps, useRecordContext } from 'react-admin';

// import statusCodes from '../../constants/SelectFields/LicenseStatus';
// import { User } from '../../types';

// const LicenseStateInput = (props: SelectInputProps) => {
//     const { source } = props;
 
//     const handleOnChange = (value: any) => {
//         if (source === 'businessLicenseState') {
//             console.log(value);
//         }
//     };

//     return (
//         <SelectInput
//             {...props}
//             translateChoice
//             choices={statusCodes}
//             onChange={e => handleOnChange(e)}
//             emptyValue={null}
//         />
//     );
// };

// export default LicenseStateInput;
