import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import { Datagrid, DateField, ImageField, List, NumberField, ReferenceField, RichTextField, Show, SimpleShowLayout, TextField, useRecordContext, useTranslatable, useTranslate } from 'react-admin';
import ProductImages from '../components/products/ProductImage';
import ProductIngredientDisplayTable from '../components/products/ProductIngredientTable/ProductIngredientDisplayTable';
import ProductIngredientTable from '../components/products/ProductIngredientTable/ProductIngredientTable';

const ProductTitle = () => {
    const record = useRecordContext();
    return <span>{record ? `${record.name}` : ''}</span>;
};

const ProductShow = () => {

    return (
        <Show title={<ProductTitle />}>
            <SimpleShowLayout>
                <Grid container width={{ xs: '100%', xl: '100%' }} spacing={8}>
                    <Grid item xs={12} md={6}>
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={2} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <SectionTitle label='resources.products.fields.name' />
                                <SimpleShowLayout>
                                    <TextField source="name" label='' />
                                </SimpleShowLayout>

                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 0, ml: 1 }}>
                                <SectionTitle label='resources.products.fields.price_net' />
                                <SimpleShowLayout>
                                    <NumberField 
                                        source='price'
                                        options={{
                                            style: 'currency',
                                            currency: 'EUR',
                                        }}
                                        label=''
                                    />
                                </SimpleShowLayout>
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 0, ml: 1 }}>
                                <SectionTitle label='resources.products.fields.value_added_tax' />
                                <SimpleShowLayout>
                                    <NumberField 
                                        source='vat'
                                        options={{
                                            style: 'percent',   
                                        }}
                                        textAlign='left'
                                        label=''
                                    />
                                </SimpleShowLayout>
                            </Box>
                        </Box>
                        <Separator />
 
                        <Box display={{ xs: 'block', sm: 'flex', width: '100%' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <SectionTitle label='resources.products.fields.created_at' />
                                <SimpleShowLayout>
                                    <DateField source="createdAt" label='' locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                                </SimpleShowLayout>
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                                <SectionTitle label='resources.products.fields.updated_at' />
                                <SimpleShowLayout>
                                    <DateField source="updatedAt" label='' locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                                </SimpleShowLayout>
                            </Box>
                        </Box>
                        
                        <SectionTitle label='resources.products.field_groups.product_images' />
                        <SimpleShowLayout>
                            <ProductImages />
                            <Separator />
                        </SimpleShowLayout> 
                        
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <SectionTitle label='resources.products.field_groups.product_description' />
                        <SimpleShowLayout>
                            <RichTextField source="description" label='' />
                            <Separator />
                        </SimpleShowLayout>

                        <SectionTitle label='resources.products.field_groups.product_item_number' />
                        <SimpleShowLayout>
                            <TextField source="itemNumber" label='' />
                            <Separator />
                        </SimpleShowLayout>

                        <SectionTitle label='resources.products.field_groups.product_ingredients' />
                        <SimpleShowLayout>                   
                            {/* <RichTextField source="ingredients" label='' /> */}
                            <ProductIngredientDisplayTable />
                            <Separator />
                        </SimpleShowLayout>
                        <SectionTitle label='resources.products.field_groups.product_consumption' />
                        <SimpleShowLayout>
                            <RichTextField source="consumption" label='' />
                            <Separator />
                        </SimpleShowLayout>
                    </Grid>
                </Grid>
                
            </SimpleShowLayout>
        </Show>
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

export default ProductShow;