import * as React from 'react';
import {
    Avatar,
    Box,
    Button,
    CardMedia,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';
import CustomerIcon from '@mui/icons-material/PersonAdd';
import { Link } from 'react-router-dom';
import { useTranslate, useGetList, ImageField } from 'react-admin';
import { subDays } from 'date-fns';

import CardWithIcon from './CardWithIcon';
import { Product } from '../../types';

const NewProducts = () => {
    const translate = useTranslate();

    const aMonthAgo = subDays(new Date(), 30);
    aMonthAgo.setDate(aMonthAgo.getDate() - 30);
    aMonthAgo.setHours(0);
    aMonthAgo.setMinutes(0);
    aMonthAgo.setSeconds(0);
    aMonthAgo.setMilliseconds(0);

    const { isLoading, data: products } = useGetList<Product>('products', {
        filter: {
            // has_ordered: true,
            date_gte: aMonthAgo.toISOString(),
        },
        sort: { field: 'createdAt', order: 'DESC' },
        pagination: { page: 1, perPage: 50 },
    });

    const nb = products ? products.reduce((nb: number) => ++nb, 0) : 0;
    return (
        <CardWithIcon
            to="/products"
            icon={CustomerIcon}
            title={translate('pos.dashboard.new_products')}
            subtitle={nb}
        >
            <List sx={{ display: isLoading ? 'none' : 'block' }}>
                {products
                    ? products.map((record: Product) => (
                          <ListItem
                              button
                              to={`/products/${record.id}`}
                              component={Link}
                              key={record.id}
                          >
                                {record.images.length > 0 && 
                                    <ListItemAvatar>
                                        <CardMedia 
                                            component='img'
                                            src={ record.images[0].url }
                                            sx={{
                                                width: 32,
                                                height: 32
                                            }} />
                                    </ListItemAvatar>
                                }
                              <ListItemText
                                  primary={record.name}
                              />
                          </ListItem>
                      ))
                    : null}
            </List>
            <Box flexGrow={1}>&nbsp;</Box>
            <Button
                sx={{ borderRadius: 0 }}
                component={Link}
                to="/products"
                size="small"
                color="primary"
            >
                <Box p={1} sx={{ color: 'primary.main' }}>
                    {translate('pos.dashboard.all_products')}
                </Box>
            </Button>
        </CardWithIcon>
    );
};

export default NewProducts;
