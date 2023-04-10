import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import { EditButton, ImageField, NumberField, RecordContextProvider, useListContext, useTranslate } from 'react-admin';
import { Product } from '../types';
import ProductImages from '../components/products/ProductImage';

const ProductListMobileGrid = () => {
    const translate = useTranslate();
    const { data, isLoading } = useListContext<Product>();

    if ( isLoading || data.length === 0 ) {
        return null;
    }

    return (
        <Box margin="0.5em">
            {data.map(record => (
                <RecordContextProvider key={record.id} value={record}>
                    <Card sx={{ margin: '0.5rem 0' }}>
                        <CardHeader
                            title={`${record.name}`}
                            subheader={
                                <>
                                    {translate(
                                        'resources.products.fields.price_net'
                                    )}
                                    &nbsp;
                                    <NumberField 
                                        source='price'
                                        options={{
                                            style: 'currency',
                                            currency: 'EUR',
                                        }}
                                        label='resources.products.fields.price_net'
                                    />
                                </>
                            }
                            action={<EditButton />} />
                        <CardContent sx={{ pt: 0 }}>
                            <ProductImages />
                            {/* <ImageField source='images' src='url' label='resources.products.fields.images' /> */}
                        </CardContent>
                    </Card>
                </RecordContextProvider>
            ))}
        </Box>
    );
};

export default ProductListMobileGrid;