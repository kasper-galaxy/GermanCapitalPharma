import * as React from 'react';
import PropTypes from 'prop-types';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import GppBadIcon from '@mui/icons-material/GppBad';
import Button from '@mui/material/Button';
import { BooleanInput, ButtonProps, useNotify, useRecordContext, useRefresh, useTranslate } from 'react-admin';
import { User } from '../../types';
import myDataProvider from '../../dataProvider/myDataProvider';
import config from '../../config';
import { useMutation } from 'react-query';
import { useFormContext } from 'react-hook-form';
import { KEY_LICENSE_DOCUMENT_APPROVED, KEY_LICENSE_DOCUMENT_REJECTED } from '../../constants/SelectFields/LicenseStatusKey';

const UserVerifiedInput = ( {...props} ) => {
    console.log('user verify btn');
    const translate = useTranslate();
    const notify = useNotify();
    const refresh = useRefresh();
    const record = useRecordContext<User>();
    const dataProvider = myDataProvider(config.API_URL);
    const { setValue, getValues } = useFormContext();
    const [ verified, setVerified ] = React.useState(record.userVerified);
    
    const params = {
        id: record.id, 
        data: { userVerified: !record.userVerified },
    };

    const { mutate, isLoading, isSuccess, isError } = useMutation(
        [
            'sendUserVerified', 'users',
            params
        ],
        () => dataProvider.sendUserVerified('users', params)
    );

    const verifiedHandler = () => {
        if (verified) { // Set to FALSE
            setValue('userVerified', false);
            setVerified(false);
            setValue('businessLicenseState', KEY_LICENSE_DOCUMENT_REJECTED);
            if (getValues('officialDocument')) {
                setValue('officialDocumentState', KEY_LICENSE_DOCUMENT_REJECTED);
            }
        } else {                    // Set to TRUE
            setValue('userVerified', true);
            setVerified(true);
            setValue('emailConfirmed', true);
            setValue('businessLicenseState', KEY_LICENSE_DOCUMENT_APPROVED);
            if (getValues('officialDocument')) {
                setValue('officialDocumentState', KEY_LICENSE_DOCUMENT_APPROVED);
            }
        }
    }

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

    return !verified ? (
        <Button
            variant="outlined"
            color="success"
            size="medium"
            onClick={() => verifiedHandler()}
            fullWidth
            startIcon={<FactCheckIcon sx={{ color: 'green' }} />}
            disabled={isLoading}
        >
            {translate('resources.users.actions.verify')}
        </Button>
        ) : (
            <Button
                variant="outlined"
                color="error"
                size="medium"
                fullWidth
                onClick={() => verifiedHandler()}
                startIcon={<GppBadIcon sx={{ color: 'red' }} />}
                disabled={isLoading}
            >
                {translate('resources.users.actions.cancel_verify')}
            </Button>
        );
}

UserVerifiedInput.propTypes = {
    record: PropTypes.any
};

export default UserVerifiedInput;
