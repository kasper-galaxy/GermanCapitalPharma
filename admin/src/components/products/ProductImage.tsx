import * as React from 'react';
import { Card, CardMedia, Grid } from '@mui/material';
import { useRecordContext } from 'react-admin';
import { Product } from '../../types';

const ProductImages = () => {
    const record = useRecordContext<Product>();
    if (!record) return null;
    return (
        <Card sx={{ display: 'inline' }}>
            <Grid container spacing={2}>
                {record.images.map((image) => (
                    <Grid item xs={12} sm={12} md={6} lg={3}>
                        <CardMedia
                            component="img"
                            image={image.url}
                            alt=""
                            sx={{ maxWidth: '42em', maxHeight: '42em' }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Card>
    );
};

export default ProductImages;