import * as React from 'react';
import { Datagrid, DateField, DateInput, DeleteButton, Edit, ImageField, ImageInput, List, NumberField, NumberInput, ReferenceField, required, SaveButton, Show, ShowButton, SimpleForm, SimpleShowLayout, TextField, TextInput, Toolbar, TopToolbar, useNotify, useRecordContext, useRedirect, useRefresh, useTranslate } from 'react-admin';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Grid, Typography } from '@mui/material';
import { RichTextInput } from 'ra-input-rich-text';
import ProductImageInputField from '../components/products/ProductImageInputField';
import ProductIngredientTable from '../components/products/ProductIngredientTable/ProductIngredientTable';
import { Product } from '../types';

const ProductEditActions = () => (
    <TopToolbar>
        <ShowButton 
            icon={<CancelIcon />}
            label='resources.users.actions.cancel'/>
    </TopToolbar>
);

const ProductTitle = () => {
    const record = useRecordContext();
    return <span>{record ? `${record.name}` : ''}</span>;
};

const validateName = [required()];
const validatePrice = [required()];
const validateDescription = [required()];
const validateIngredients = [required()];
const validateConsumption = [required()];
const validateItemNumber = [required()];

const MyToolbar = ({...props}) => {
    const record = useRecordContext<Product>();

    return (
        <Toolbar {...props}>
            <Box flex={1} display={{ xs: 'block', sm: 'flex' }} justifyContent={'space-between'} >
                <SaveButton type="button" alwaysEnable sx={{ marginRight: 4 }} />
                <DeleteButton confirmTitle={`Lösche produkte "${record.name}"`} />
            </Box>
        </Toolbar>
    );
};

const ProductEdit = () => {
    const notify = useNotify();
    const translate = useTranslate();
    const redirect = useRedirect();
    const refresh = useRefresh();

    // const ingredientDataChangeHandler = (columns: any, data: any) => {
    //     console.log('body handler ', JSON.stringify({columns, data}));
    // }
    const onError = (error: any) => {
        notify(error.message, { type: 'error' });
    }

    const onSuccess = (data: any) => {
        console.log('success ', data);
        redirect(`/products/${data.id}/show`);
        refresh();
    }

    return (
        <Edit title={<ProductTitle />} mutationOptions={{ onError, onSuccess }} mutationMode='pessimistic' actions={<ProductEditActions />}>
            <SimpleForm toolbar={<MyToolbar />}>
                <Grid container width={{ xs: '100%', xl: '100%' }} spacing={8}>
                    <Grid item xs={12} md={6}>
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={2} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <SectionTitle label='resources.products.fields.name' />
                                <SimpleShowLayout>
                                    <TextInput source="name" label='' fullWidth validate={validateName} />
                                </SimpleShowLayout>

                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 0, ml: 1 }}>
                                <SectionTitle label='resources.products.fields.price_net' />
                                <SimpleShowLayout>
                                    <NumberInput source="price" 
                                        label=''
                                        options={{
                                            style: 'currency',
                                            currency: 'EUR',
                                    }} fullWidth validate={validatePrice} />
                                </SimpleShowLayout>
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 0, ml: 1 }}>
                                <SectionTitle label='resources.products.fields.value_added_tax' />
                                <SimpleShowLayout>
                                    <NumberInput source="vat" 
                                        label=''
                                        options={{
                                            style: 'percent',
                                    }} fullWidth validate={validatePrice} />
                                </SimpleShowLayout>
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
                        <RichTextInput source="description" label='' fullWidth validate={validateDescription} />
                        <Separator />
                        
                        <SectionTitle label='resources.products.fields.item_number' />
                        <TextInput source="itemNumber" label='' fullWidth validate={validateItemNumber} />
                        <Separator />

                        <SectionTitle label='resources.products.fields.ingredients' />
                        {/* <RichTextInput source="ingredients" label='' fullWidth validate={validateIngredients} /> */}
                        <ProductIngredientTable 
                            // changeHandler={ingredientDataChangeHandler}
                            />
                        <Separator />

                        <SectionTitle label='resources.products.fields.consumption' />
                        <RichTextInput source="consumption" label='' fullWidth validate={validateConsumption} />
                        <Separator />
                        <Separator />
                    </Grid>
                </Grid>
            </SimpleForm>
        </Edit>
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

export default ProductEdit;