import * as React from 'react';
import { useMediaQuery, Theme } from '@mui/material';
import {
    List, Datagrid, TextField, WrapperField
} from 'react-admin';
import NotificationMobileGrid from './notifications.mobile';
import DescriptionField from '../components/notification/description';

const NotificationList = () => {
    const isXsmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));
    return (
        <List>
            {isXsmall ? ( <NotificationMobileGrid />) : (
                <Datagrid>
                    <WrapperField label="resources.notifications.fields.description">
                        <DescriptionField />
                    </WrapperField>
                    <TextField source="user" label="resources.notifications.fields.user" />
                    <TextField source="createdAt" label="resources.notifications.fields.createdAt" />
                </Datagrid>
            )}
        </List>
    );
}

export default NotificationList;