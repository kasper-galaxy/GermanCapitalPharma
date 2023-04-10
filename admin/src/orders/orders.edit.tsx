import * as React from 'react';
import {
    BooleanInput,
    DateField,
    DateInput,
    DeleteButton,
    Edit,
    Form,
    Labeled,
    ReferenceField,
    SaveButton,
    SelectInput,
    TextField,
    Toolbar,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, Box, Grid, Typography, Link } from '@mui/material';

import { Order, User } from '../types';
import Basket from './Basket';
import Totals from './Totals';
import OrderReturnInput from '../components/order/OrderReturnInput';
import OrderDeliveredInput from '../components/order/OrderDeliveredInput';

const MyToolbar = ({...props}) => {
    const record = useRecordContext<Order>();

    return (
        <Toolbar {...props}>
            <Box flex={1} display={{ xs: 'block', sm: 'flex' }} justifyContent={'space-between'} >
                <SaveButton type="button" alwaysEnable sx={{ marginRight: 4 }} />
                <DeleteButton confirmTitle={`Lösche Bestellungen "${record.id}"`} />
            </Box>
        </Toolbar>
    );
};

const OrderEdit = () => (
    <Edit title={<OrderTitle />} component="div"  sx={{ maxWidth: '50em' }}>
        <OrderForm />
    </Edit>
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

const CustomerDetails = () => {
    const record = useRecordContext<User>();
    return (
        <div>
            <Typography
                component={RouterLink}
                color="primary"
                to={`/users/${record?.id}`}
                style={{ textDecoration: 'none' }}
            >
                {record?.nameFirst} {record?.nameLast}
            </Typography>
            <Typography
                component={Link}
                color="primary"
                href={`mailto:${record?.email}`}
                style={{ textDecoration: 'none' }}
            >
                {record?.email}
            </Typography>
        </div>
    );
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
    const paidAtRef = React.useRef<HTMLInputElement>();
    const expectedAtRef = React.useRef<HTMLInputElement>();
    const [canDeliveryCheck, setCanDeliveryCheck] = React.useState(record.expectedPaymentAt || record.receivedPaymentAt ? true : false);

    const onPaidAtChange = () => {
        const paid_at = paidAtRef.current ? paidAtRef.current.value : null;
        if (expectedAtRef && expectedAtRef.current && paid_at) {
            expectedAtRef.current.value = '';
            setCanDeliveryCheck(true);
        }
    };
    
    const onExpectedAtChange = () => {
        const expected_at = expectedAtRef.current ? expectedAtRef.current.value : null;
        if (paidAtRef && paidAtRef.current && expected_at) {
            paidAtRef.current.value = '';
            setCanDeliveryCheck(true);
        }
    };

    if (!record)
        return null;

    return (
        <Form>
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
                                        <Labeled source="created_at">
                                            <DateField source="createdAt" locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                                        </Labeled>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Labeled source="reference">
                                            <TextField source="id" />
                                        </Labeled>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Labeled source="updated_at">
                                            <DateField source="updatedAt" locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                                        </Labeled>
                                    </Grid>
                                </Grid>
                                <Separator />
                                <Grid container>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Labeled source='status'>
                                            <Typography sx={{ fontWeight: 'bold' }}> {translate(`resources.orders.constants.status.${record.status}`)} </Typography>
                                        </Labeled>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Labeled source="delivery_status">
                                            {/* <Typography sx={{ fontWeight: 'bold' }}> {translate(`resources.orders.constants.status.${record.deliveryStatus}`)} </Typography> */}
                                            <OrderDeliveredInput canDeliveryCheck={canDeliveryCheck} />
                                        </Labeled>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <Labeled source="payment_status">
                                            <Typography sx={{ fontWeight: 'bold' }}>{translate(`resources.orders.constants.status.${record.paymentStatus}`)} </Typography>
                                        </Labeled>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Separator />
                            <Grid item xs={12} sm={12} md={4}>
                                <Typography variant="h6" gutterBottom>
                                    {translate(
                                        'resources.orders.section.pharmacy'
                                    )}
                                </Typography>
                                <ReferenceField
                                    source="user"
                                    reference="users"
                                    link={'show'}
                                >
                                    <TextField source="companyName" />
                                    {/* <CustomerDetails /> */}
                                </ReferenceField>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4}>
                                <Typography variant="h6" gutterBottom>
                                    {translate(
                                        'resources.orders.section.delivery_address'
                                    )}
                                </Typography>
                                <ReferenceField
                                    source="user"
                                    reference="users"
                                    link={false}
                                >
                                    <CustomerAddress />
                                </ReferenceField>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4}>
                                <Typography variant="h6" gutterBottom>
                                    {translate(
                                        'resources.orders.fields.source'
                                    )}
                                </Typography>
                                <TextField source="source" />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Typography variant="h6" gutterBottom>
                                    {translate(
                                        'resources.orders.section.payment'
                                    )}
                                </Typography>
                                <Grid container>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <DateInput source='receivedPaymentAt' inputRef={paidAtRef} onChange={onPaidAtChange} label='resources.orders.fields.received_payment_at' inputProps={{ max: new Date().toISOString().slice(0, 10) }} ></DateInput>
                                        {/* <Labeled source="status">
                                            <TextField source="status" />
                                        </Labeled> */}
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <DateInput source='expectedPaymentAt' inputRef={expectedAtRef} onChange={onExpectedAtChange} label='resources.orders.fields.expected_payment_at' inputProps={{ min: new Date().toISOString().slice(0, 10) }} ></DateInput>

                                        {/* <Labeled source="delivery_status">
                                            <TextField source="deliveryStatus" />
                                        </Labeled> */}
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={4} pt={2}>
                                        <OrderReturnInput canDeliveryCheck={canDeliveryCheck} />
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
                    <MyToolbar />
                </Card>
            </Box>
        </Form>
    );
};

const Separator = () => <Box pt="1.5em" />;

export default OrderEdit;
