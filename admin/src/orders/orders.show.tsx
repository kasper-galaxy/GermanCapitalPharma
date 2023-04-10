import * as React from 'react';
import {
    BooleanField,
    DateField,
    FileField,
    Labeled,
    ReferenceField,
    Show,
    SimpleShowLayout,
    TextField,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, Box, Grid, Typography, Link } from '@mui/material';

import { Order, User } from '../types';
import Basket from './Basket';
import Totals from './Totals';

const OrderShow = () => (
    <Show title={<OrderTitle />} sx={{ maxWidth: '50em' }}>
        <OrderForm />
    </Show>
);

const OrderTitle = () => {
    const translate = useTranslate();
    const record = useRecordContext<Order>();
    return record ? (
        <span>
            {translate('resources.orders.title', {
                reference: record.id,
            })}
        </span>
    ) : null;
};

const CustomerAddress = () => {
    const record = useRecordContext<User>();
    return (
        <div>
            <Typography>
                {record?.nameFirst} {record?.nameLast}
            </Typography>
            <Typography>
                {record?.addressStreet}, {record?.addressHouse}
            </Typography>
            <Typography>
                {record?.addressZipCode}, {record?.addressCity}
            </Typography>
        </div>
    );
};

const Spacer = () => <Box m={1}>&nbsp;</Box>;

const OrderForm = () => {
    const record = useRecordContext<Order>();
    const translate = useTranslate();

    if (!record)
        return null;

    return (
            <Box maxWidth="50em">
                <Card>
                    <CardContent>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12}>
                                <Typography variant="h6" gutterBottom>
                                    {translate(
                                        'resources.orders.section.order'
                                    )}
                                </Typography>
                                <Grid container>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {translate(
                                                'resources.orders.fields.created_at'
                                            )}
                                        </Typography>
                                        <DateField source="createdAt" locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {translate(
                                                'resources.orders.fields.reference'
                                            )}
                                        </Typography>
                                        <TextField source="id" />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {translate(
                                                'resources.orders.fields.source'
                                            )}
                                        </Typography>
                                        <TextField source="source" />
                                    </Grid>
                                </Grid>
                                <Separator />
                                <Grid container>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {translate(
                                                'resources.orders.fields.status'
                                            )}
                                        </Typography>
                                        <Typography sx={{ fontWeight: 'bold' }}> {translate(`resources.orders.constants.status.${record.status}`)} </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {translate(
                                                'resources.orders.fields.delivery_status'
                                            )}
                                        </Typography>
                                        <Typography sx={{ fontWeight: 'bold' }}> {translate(`resources.orders.constants.status.${record.deliveryStatus}`)} </Typography>

                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {translate(
                                                'resources.orders.fields.payment_status'
                                            )}
                                        </Typography>
                                        <Typography sx={{ fontWeight: 'bold' }}>{translate(`resources.orders.constants.status.${record.paymentStatus}`)} </Typography>
                                    </Grid>
                                </Grid>
                                <Separator />
                            </Grid>
                            <Grid item xs={12} sm={12} md={4}>
                                <Typography variant="subtitle1" gutterBottom>
                                    {translate(
                                        'resources.orders.section.pharmacy'
                                    )}
                                </Typography>
                                <TextField source="companyName" />
                            </Grid>
                            <Grid item xs={12} sm={12} md={4}>
                                <Typography variant="subtitle1" gutterBottom>
                                    {translate(
                                        'resources.orders.section.delivery_address'
                                    )}
                                </Typography>
                                {/* <ReferenceField
                                    source="user"
                                    reference="users"
                                    link={false}
                                >
                                    <CustomerAddress />
                                </ReferenceField> */}
                                <TextField source="deliveryAddress" />
                            </Grid>
                            <Grid item xs={12} sm={12} md={4}>
                                <Typography variant="subtitle1" gutterBottom>
                                    {translate(
                                        'resources.orders.fields.invoice'
                                    )}
                                </Typography>
                                <ReferenceField source='invoice' reference='invoices' link={false}>
                                    <FileField source="url" target="_blank" title={translate('resources.orders.actions.open')}/>
                                </ReferenceField>
                            </Grid>
                            <Spacer />
                            <Grid item xs={12} sm={12}>
                                <Typography variant="h6" gutterBottom>
                                    {translate(
                                        'resources.orders.section.payment'
                                    )}
                                </Typography>
                                <Grid container>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {translate(
                                                'resources.orders.fields.received_payment_at'
                                            )}
                                        </Typography>
                                        <DateField source="receivedPaymentAt" sx={{ fontWeight: 'bold' }} locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                                        {/* <Labeled source="status">
                                            <TextField source="status" />
                                        </Labeled> */}
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {translate(
                                                'resources.orders.fields.expected_payment_at'
                                            )}
                                        </Typography>
                                        <DateField source="expectedPaymentAt" sx={{ fontWeight: 'bold' }} locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />

                                        {/* <Labeled source="delivery_status">
                                            <TextField source="deliveryStatus" />
                                        </Labeled> */}
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {translate(
                                                'resources.orders.fields.cancelled'
                                            )}
                                        </Typography>
                                        <BooleanField source="cancelled" />

                                        {/* <Labeled source="delivery_status">
                                            <TextField source="deliveryStatus" />
                                        </Labeled> */}
                                    </Grid>
                                    {/* <Grid item xs={12} sm={12} md={4}>
                                        <Labeled source="payment_status">
                                            <TextField source="paymentStatus" />
                                        </Labeled>
                                    </Grid> */}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Spacer />

                        <Typography variant="h6" gutterBottom>
                            {translate('resources.orders.section.items')}
                        </Typography>
                        <div>
                            <Basket />
                        </div>
                        <Spacer />

                        <Typography variant="h6" gutterBottom>
                            {translate('resources.orders.section.total')}
                        </Typography>
                        <div>
                            <Totals />
                        </div>
                    </CardContent>
                </Card>
            </Box>
    );
};

const Separator = () => <Box pt="1.5em" />;

export default OrderShow;
