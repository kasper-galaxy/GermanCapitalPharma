import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import { DateField, EditButton, NumberField, RecordContextProvider, useListContext, useTranslate } from 'react-admin';
import { User } from '../types';

const UserListMobileGrid = () => {
    const translate = useTranslate();
    const { data, isLoading } = useListContext<User>();

    if ( isLoading || data.length === 0 ) {
        return null;
    }

    return (
        <Box margin="0.5em">
            {data.map(record => (
                <RecordContextProvider key={record.id} value={record}>
                    <Card sx={{ margin: '0.5rem 0' }}>
                        <CardHeader
                            title={`${record.nameFirst} ${record.nameLast}`}
                            subheader={
                                <>
                                    {translate(
                                        'resources.users.fields.last_seen'
                                    )}
                                    &nbsp;
                                    <DateField source="lastSeen" locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                                </>
                            }
                            action={<EditButton />} />
                        <CardContent sx={{ pt: 0 }}>
                            <Typography variant='body2'>
                                {translate(
                                    'resources.orders.name',
                                    0
                                )}
                                :&nbsp;
                                <NumberField source='totalOrders' />
                            </Typography>
                            <Typography variant='body2'>
                                {translate(
                                    'resources.users.fields.total_spent'
                                )}
                                :&nbsp;
                                <NumberField 
                                    source='totalSpent'
                                    options={{
                                        style: 'currency',
                                        currency: 'EUR',
                                    }}
                                />
                            </Typography>
                        </CardContent>
                    </Card>
                </RecordContextProvider>
            ))}
        </Box>
    );
};

export default UserListMobileGrid