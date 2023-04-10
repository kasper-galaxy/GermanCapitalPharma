import { Box, Card, Grid, Typography } from '@mui/material';
import { RichTextInput } from 'ra-input-rich-text';
import * as React from 'react';
import { Create, Datagrid, DateField, DateInput, Edit, ImageField, ImageInput, List, NumberField, NumberInput, ReferenceField, required, Show, SimpleForm, SimpleShowLayout, TextField, TextInput, useNotify, useRecordContext, useRedirect, useTranslate } from 'react-admin';
import ProductImageInputField from '../components/products/ProductImageInputField';
import ProductIngredientTable from '../components/products/ProductIngredientTable/ProductIngredientTable';

const validateName = [required()];
const validatePrice = [required()];
const validateDescription = [required()];
const validateIngredients = [required()];
const validateConsumption = [required()];
const validateItemNumber = [required()];

const ProductCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const translate = useTranslate();

    const onError = (error: any) => {
        notify(error.message, { type: 'error' });
    }

    const onSuccess = (data: any) => {
        console.log('success ', data);
        redirect(`/products/${data.id}/show`);
    }

    return (
        <Create mutationOptions={{ onError, onSuccess }} redirect="show">
            <SimpleForm
                defaultValues={{
                    vat: 0.07,
                }}>
                <Grid container width={{ xs: '100%', xl: '100%' }} spacing={8}>
                    <Grid item xs={12} md={6}>
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={2} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <SectionTitle label='resources.products.fields.name' />
                                <TextInput source="name" label='' fullWidth validate={validateName} />
 
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 0, ml: 1 }}>
                                <SectionTitle label='resources.products.fields.price_net' />
                                <NumberInput source="price" 
                                    label=''
                                    options={{
                                        style: 'currency',
                                        currency: 'EUR',
                                }} fullWidth validate={validatePrice} />
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 0, ml: 1 }}>
                                <SectionTitle label='resources.products.fields.value_added_tax' />
                                <NumberInput source="vat" 
                                    label=''
                                    options={{
                                        style: 'percent',
                                }} fullWidth validate={validatePrice} />
                            </Box>
                        </Box>

                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <SectionTitle label='resources.products.field_groups.product_images' />
                                <ImageInput source="images" label="" multiple accept="image/*"
                                    placeholder={<p>{translate('resources.products.fields.upload_product_images')}</p>}
                                    maxSize={5000000} maxFiles={4} fullWidth>

                                        <ProductImageInputField />                            
        
                                    {/* <ImageField source="url" title="" /> */}
                                </ImageInput>
                            </Box>
                        </Box>
                        <Separator />
                    </Grid>
                    <Grid item xs={12} md={6}>  
                        <SectionTitle label='resources.products.fields.description' />
                        <RichTextInput source="description" label='' validate={validateDescription} />
                        <Separator />

                        <SectionTitle label='resources.products.fields.item_number' />
                        <TextInput source="itemNumber" label='' validate={validateItemNumber} />
                        <Separator />

                        <SectionTitle label='resources.products.fields.ingredients' />
                        {/* <RichTextInput source="ingredients" label='' validate={validateIngredients} /> */}
                        <ProductIngredientTable />
                        <Separator />

                        <SectionTitle label='resources.products.fields.consumption' />
                        <RichTextInput source="consumption" label='' validate={validateConsumption} />
                        <Separator />
                        <Separator />
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

export default ProductCreate;