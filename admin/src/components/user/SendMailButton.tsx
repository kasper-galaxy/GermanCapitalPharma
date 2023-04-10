import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useNotify, useRecordContext, useTranslate } from 'react-admin';
import { User } from '../../types';
import { useMutation } from 'react-query';
import myDataProvider from '../../dataProvider/myDataProvider';
import config from '../../config';
import { ADMIN_ACTION_SEND_MAIL_CHECK_EMAIL, ADMIN_ACTION_SEND_MAIL_PROXY_PASSWORD } from '../../constants/ActionMsg';
import { Box } from '@mui/system';

const dataProvider = myDataProvider(config.API_URL);

const SendMailButton = ({...props}) => {
    const translate = useTranslate();
    const notify = useNotify();
    const record = useRecordContext<User>();
    const { label, type } = props;
    const params = { 
        id: record.id, 
        data: { type: type },
    }
    const { mutate, isLoading, isSuccess, isError } = useMutation(
        [
            'sendMailToUser', 'users',
            params
        ],
        () => dataProvider.sendMailToUser('users', params)
    );

    let allowed = true;
    switch (type) {
        case ADMIN_ACTION_SEND_MAIL_CHECK_EMAIL:
            if (record.emailConfirmed || record.userProxy) {
                allowed = false;
            }
            break;
        case ADMIN_ACTION_SEND_MAIL_PROXY_PASSWORD:
            if (!record.userProxy) {
                allowed = false;
            }
            break;
        default:
            break;
    }

    React.useEffect(() => {
        if (isSuccess) {
            notify('resources.users.messages.send_mail_success', { type: 'success' });
        }
    }, [isSuccess, notify]);

    
    React.useEffect(() => {
        if (isError) {
            notify('resources.users.messages.send_mail_failed', { type: 'error' });
        }
    }, [isError, notify]);

    return record && allowed ? (
        <>
            <Separator />
            <Button
                variant='outlined'
                color='primary'
                size='medium'
                startIcon={<ContactMailIcon sx={{ color: 'green' }} />}
                disabled={isLoading}
                onClick={() => mutate()}
            >
                {translate(label)}

            </Button>
        </>
    ) : (
        <span />
    );
}

const Separator = () => <Box pt="1.5em" />;

SendMailButton.propTypes = {
    record: PropTypes.any,
    label: PropTypes.string,
    type: PropTypes.string
};

export default SendMailButton;