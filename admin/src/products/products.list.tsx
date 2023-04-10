import * as React from 'react';
import { CreateButton, Datagrid, DateField, ExportButton, FilterButton, FilterLiveSearch, ImageField, List, NumberField, RichTextField, SearchInput, SortButton, TextField, TopToolbar, WrapperField } from 'react-admin';

import { useMediaQuery, Theme } from '@mui/material';
import ProductListMobileGrid from './products.list.mobile';
import ProductImages from '../components/products/ProductImage';

const ProductList = () => {
    const isXsmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));

    return (
        <List
            perPage={25}
            sort={{ field: 'updatedAt', order: 'DESC' }}
            actions={<ListActions />}
            filters={productFilters}>
            {isXsmall ? (
                <ProductListMobileGrid />
            ) : (
                <Datagrid 
                    optimized
                    rowClick="show"
                    sx={{
                        '& .column-groups': {
                            md: { display: 'none' },
                            lg: { display: 'table-cell' },
                        },
                    }}>
                    <TextField source="name" label='resources.products.fields.name' />
                    {/* <ImageField source='images' src='url' label='resources.products.fields.images' /> */}
                    <WrapperField label="resources.products.fields.images">
                        <ProductImages />
                    </WrapperField>
                    <NumberField 
                        source='price'
                        options={{
                            style: 'currency',
                            currency: 'EUR',
                        }}
                        label='resources.products.fields.price_net'
                    />
                    <RichTextField source="description" label='resources.products.fields.description' />
                    <TextField source="editBy" label="pos.common.edit_by" />
                    <DateField source="createdAt" label='resources.products.fields.created_at' locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                </Datagrid>
            )}

        </List>
    );
}

const productFilters = [
    <SearchInput source='q' alwaysOn />
];

const ListActions = ({ isSmall }: any) => (
    <TopToolbar sx={{ minHeight: { sm: 56 } }}>
        {isSmall && <FilterButton />}
        {/* <SortButton fields={['name', 'price', 'createdAt', 'updatedAt']} /> */}
        {/* <SortButton fields={['name', 'price', 'created_at', 'updated_at']} label='resources.products.sortby.name' /> */}
        <CreateButton />
        <ExportButton />        
    </TopToolbar>
);

export default ProductList;