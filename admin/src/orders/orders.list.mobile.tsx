// in src/comments.js
import * as React from 'react';
import { Box, Card, CardHeader, CardContent, Typography } from '@mui/material';
import {
    DateField,
    EditButton,
    NumberField,
    TextField,
    useTranslate,
    useListContext,
    RaRecord,
    RecordContextProvider,
} from 'react-admin';

import { Order } from '../types';

interface MobileGridProps {
    data?: RaRecord[];
}

const MobileGrid = (props: MobileGridProps) => {
    const { data, isLoading } = useListContext<Order>();
    const translate = useTranslate();
    if (isLoading || data.length === 0) {
        return null;
    }
    return (
        <Box margin="0.5em">
            {data.map(record => (
                <RecordContextProvider key={record.id} value={record}>
                    <Card sx={{ margin: '0.5rem 0' }}>
                        <CardHeader
                            title={
                                <>
                                    {translate('resources.orders.name', 1)} #
                                    <TextField
                                        source="id"
                                        variant="body1"
                                    />
                                </>
                            }
                            titleTypographyProps={{ variant: 'body1' }}
                            action={<EditButton />}
                        />
                        <CardContent sx={{ pt: 0 }}>
                            {/* <CustomerReferenceField
                                sx={{ display: 'block', mb: 1 }}
                            /> */}
                            <Typography variant="body2" gutterBottom>
                                {translate('resources.orders.fields.created_at')}
                                :&nbsp;
                                <DateField source="createdAt" locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {translate('resources.orders.fields.pharmacy_name')}
                                :&nbsp;
                                <TextField source="companyName" />
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {translate('resources.orders.fields.delivery_address')}
                                :&nbsp;
                                <TextField source="deliveryAddress" />
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {translate(
                                    'resources.orders.fields.total_price'
                                )}
                                :&nbsp;
                                <NumberField
                                    source="netPrice"
                                    options={{
                                        style: 'currency',
                                        currency: 'EUR',
                                    }}
                                />
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {translate('resources.orders.fields.status')}
                                :&nbsp;
                                <TextField source="status" />
                            </Typography>
                            <Typography variant="body2">
                                {translate(
                                    'resources.orders.fields.source'
                                )}
                                :&nbsp;
                                <TextField source="source" />
                            </Typography>
                        </CardContent>
                    </Card>
                </RecordContextProvider>
            ))}
        </Box>
    );
};

MobileGrid.defaultProps = {
    data: {},
    ids: [],
};

export default MobileGrid;