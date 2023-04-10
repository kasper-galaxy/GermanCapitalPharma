import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import { RecordContextProvider, useListContext, useTranslate } from 'react-admin';

const NotificationMobileGrid = () => {
    const translate = useTranslate();
    const { data, isLoading } = useListContext();
    if (isLoading || data.length == 0)
        return null;
    return (
        <Box>
            {data.map(record => (
                <RecordContextProvider key={record.id} value={record.value} >
                    <Card sx={{ margin:'0.5rem 0.5rem' }}>
                        <CardHeader title={`${record.user}`} />
                        <CardContent sx={{ pt:0 }}>
                            <Typography variant='body2'>
                                {translate('resources.notifications.fields.description')}                       
                                :&nbsp;
                                {record.description}
                            </Typography>
                            <Typography variant='body2'>
                                {translate('resources.notifications.fields.createdAt')}
                                :&nbsp;
                                {record.createdAt}
                            </Typography>
                        </CardContent>
                    </Card>
                </RecordContextProvider>
            ))}
        </Box>
    );
}

export default NotificationMobileGrid;