import { Box, Card, Grid, Typography } from '@mui/material';
import * as React from 'react';
import { AutocompleteInput, Create, DateInput, SimpleForm, TextInput, TextField, useNotify, useRedirect, useTranslate, ArrayInput, required, SimpleFormIterator, ReferenceInput, NumberInput, FormDataConsumer, Labeled } from 'react-admin';
import OrderDeliveredInput from '../components/order/OrderDeliveredInput';
import OrderProductIdInput from '../components/order/OrderProductIdInput';
import OrderUserIdInput from '../components/order/OrderUserIdInput';
import { Product, User } from '../types';


const OrderCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const translate = useTranslate();

    const onError = (error: any) => {
        notify(error.message, { type: 'error' });
    }

    const onSuccess = (data: any) => {
        console.log('success ', data);
        redirect(`/orders/${data.id}/show`);
    }

    return (
        <Create mutationOptions={{ onError, onSuccess }} sx={{ maxWidth: '50em' }} redirect="show">
            <SimpleForm
                defaultValues={{
                    companyName: '',
                    deliveryAddress: '',
                    source: 'manual',
                    status: 'open',
                    deliveryStatus: 'open',
                    paymentStatus: 'not_paid',
                }}>
                <Grid container width={{ xs: '100%', xl: '100%' }} spacing={2}>
                    <Grid item xs={12}>
                        <SectionTitle label='resources.orders.section.customer' />
                        <Box display={{ xs: 'block', sm: 'flex', width: '100%' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <ReferenceInput source="user" reference="users" label='resources.orders.fields.user'>
                                    <OrderUserIdInput />
                               </ReferenceInput>
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <TextInput source='companyName' label='resources.orders.fields.pharmacy_name' validate={[required()]} />
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                               <TextInput source='deliveryAddress' label='resources.orders.fields.delivery_address' validate={[required()]} />
                            </Box>
                        </Box>
                        <Separator />

                        <SectionTitle label='resources.orders.section.payment' />
                        <Box display={{ xs: 'block', sm: 'flex', width: '100%' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <DateInput source='receivedPaymentAt' label='resources.orders.fields.received_payment_at' inputProps={{ max: new Date().toISOString().slice(0, 10) }} fullWidth />
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <DateInput source='expectedPaymentAt' label='resources.orders.fields.expected_payment_at' inputProps={{ min: new Date().toISOString().slice(0, 10) }} fullWidth />
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <Labeled label="resources.orders.status.delivered">
                                    <OrderDeliveredInput />
                                </Labeled>
                                {/* <TextField source="paymentStatus" label='resources.orders.fields.payment_status' /> */}
                            </Box>
                        </Box>
                        <Separator />
                            
                        {/* <SectionTitle label='resources.orders.section.order' />
                        <Box display={{ xs: 'block', sm: 'flex', width: '100%' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <TextField source='source' label='resources.orders.fields.source' />
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <TextField source='status' label='resources.orders.fields.expected_payment_at' />
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <TextField source='deliveryStatus' label='resources.orders.fields.payment_status' />
                            </Box>
                        </Box>
                        <Separator /> */}

                        <SectionTitle label='resources.orders.section.items' />
                        <ArrayInput
                            source='orderItems'
                            defaultValue={[
                                { qty: 1 }
                            ]}>
                            <SimpleFormIterator>
                                <FormDataConsumer>
                                    {({
                                        formData,
                                        scopedFormData,
                                        getSource,
                                        ...rest
                                    }) =>
                                        <OrderProductIdInput source={getSource ? getSource('product') : 'product'} reference="products" 
                                            label='resources.orders.fields.order_item.product' {...rest}/>
                                    }
                                </FormDataConsumer>
                                <FormDataConsumer>
                                    {({
                                        formData,
                                        scopedFormData,
                                        getSource,  
                                        ...rest
                                    }) =>
                                        <>
                                            <Box display={{ xs: 'block', sm: 'flex', width: '100%' }}>
                                                <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2}}>
                                                    <TextInput
                                                        label='resources.orders.fields.order_item.name'
                                                        source={getSource ? getSource('name') : 'name'}
                                                        validate={[required()]}
                                                    />
                                                </Box>
                                                <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                                    <NumberInput
                                                        label='resources.orders.fields.order_item.price'
                                                        source={getSource ? getSource('price') : 'price'}
                                                        validate={[required()]}
                                                    />
                                                </Box>
                                            </Box>
                                            <Box display={{ xs: 'block', sm: 'flex', width: '100%' }}>
                                                <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2 }}>
                                                    <NumberInput
                                                        label='resources.orders.fields.order_item.vat'
                                                        source={getSource ? getSource('vat') : 'vat'}
                                                        validate={[required()]}
                                                    />
                                                </Box>
                                                <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                                    <NumberInput
                                                        label='resources.orders.fields.order_item.qty'
                                                        source={getSource ? getSource('qty') : 'qty'}
                                                        validate={[required()]}
                                                    />
                                                </Box>
                                            </Box>
                                        </>
                                    }
                                </FormDataConsumer>
                            </SimpleFormIterator>
                        </ArrayInput>
                    </Grid>
                </Grid>
            </SimpleForm>
        </Create>
    );
}

const SectionTitle = ({ label }: { label: string }) => {
    const translate = useTranslate();

    return (
        <Typography variant="h6" gutterBottom>
            {translate(label as string)}
        </Typography>
    );
};

const Separator = () => <Box pt="1.5em" />;

export default OrderCreate;