import * as React from 'react';
import { Fragment, useState, useEffect, useCallback } from 'react';
import { useMediaQuery, Divider, Tabs, Tab, Theme } from '@mui/material';
import { Datagrid, DateField, List, NumberField, TextField, ReferenceField, useListContext, RaRecord, useGetList, ListContextProvider, SearchInput, ReferenceInput, AutocompleteInput, DateInput, useTranslate } from 'react-admin';
import { User } from '../types';
import MobileGrid from './orders.list.mobile';

const OrderList = () => {
    return (
        <List
            filterDefaultValues={{ status: 'open' }}
            perPage={25}
            sort={{ field: 'updatedAt', order: 'DESC' }}
            filters={orderFilters}
            >
            <TabbedDatagrid />
            {/* <Datagrid rowClick="show">
                <DateField source="createdAt" />
                <TextField source="id" />
                <ReferenceField source="user" reference="users" link="show"><TextField source="companyName" /></ReferenceField>
                <TextField source="deliveryAddress" />
                <NumberField source="totalPrice" />
                <TextField source="source" />
                <DateField source="updatedAt" />
            </Datagrid> */}
        </List>
    );
};

const orderFilters = [
    <SearchInput source="q" alwaysOn />,
    <ReferenceInput source="user" reference="users">
        <AutocompleteInput
            optionText={(choice?: User) =>
                choice?.id // the empty choice is { id: '' }
                    ? `${choice.id}`
                    : ''
            }
        />
    </ReferenceInput>,
    <DateInput source="date_gte" label='resources.orders.fields.date_gte' />,
    <DateInput source="date_lte" label='resources.orders.fields.date_lte' />,
    // <TextInput source="total_gte" />,
];

const tabs = [
    { id: 'open', name: 'open' },
    { id: 'pending', name: 'pending' },
    { id: 'done', name: 'done' },
    { id: 'cancelled', name: 'cancelled' },
];

const useGetTotals = (filterValues: any) => {
    const { total: totalOpen } = useGetList('orders', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'updatedAt', order: 'DESC' },
        filter: { ...filterValues, status: 'open' },
    });
    const { total: totalPending } = useGetList('orders', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'updatedAt', order: 'DESC' },
        filter: { ...filterValues, status: 'pending' },
    });
    const { total: totalDone } = useGetList('orders', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'updatedAt', order: 'DESC' },
        filter: { ...filterValues, status: 'done' },
    });
    const { total: totalCancelled } = useGetList('orders', {
        pagination: { perPage: 1, page: 1 },
        sort: { field: 'updatedAt', order: 'DESC' },
        filter: { ...filterValues, status: 'cancelled' },
    });

    return {
        open: totalOpen,
        pending: totalPending,
        done: totalDone,
        cancelled: totalCancelled,
    };  
};

const TabbedDatagrid = () => {
    const listContext = useListContext();
    const { data, filterValues, setFilters, displayedFilters, isLoading } = listContext;
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    const [open, setOpen] = useState<RaRecord[]>([]);
    const [pending, setPending] = useState<RaRecord[]>([]);
    const [done, setDone] = useState<RaRecord[]>([]);
    const [cancelled, setCancelled] = useState<RaRecord[]>([]);
    const totals = useGetTotals(filterValues) as any;
    const translate = useTranslate();

    useEffect(() => {
        if (isLoading) {
            return;
        }
        switch (filterValues.status) {
            case 'open':
                setOpen(data);
                break;
            case 'pending':
                setPending(data);
                break;
            case 'done':
                setDone(data);
                break;
            case 'cancelled':
                setCancelled(data);
                break;
        }
    }, [data, isLoading, filterValues.status]);
    
    const handleChange = useCallback(
        (event: React.ChangeEvent<{}>, value: any) => {
            setFilters &&
                setFilters(
                    { ...filterValues, status: value },
                    displayedFilters,
                    false
                );
        },
        [displayedFilters, filterValues, setFilters]
    );

    const selectedData = 
        filterValues.status === 'open'
            ? open
            : filterValues.status === 'pending'
            ? pending
            : filterValues.status === 'done'
            ? done
            : cancelled;
    
    return (
        <Fragment>
            <Tabs
                variant='fullWidth'
                centered
                value={filterValues.status}
                indicatorColor="primary"
                onChange={handleChange}>
                { tabs.map(choice => (
                    <Tab 
                        key={choice.id}
                        label={
                            totals[choice.name]
                                ? `${translate('resources.orders.status.' + choice.name)} (${totals[choice.name]})`
                                : translate('resources.orders.status.' + choice.name) }
                        value={choice.id}
                    />
                )) }
            </Tabs>
            <Divider />
            { isXSmall ? 
                (
                    <ListContextProvider value={{ ...listContext, data: selectedData }}>
                        <MobileGrid data={selectedData} />
                    </ListContextProvider>
                ) : 
                (
                    <>
                        {filterValues.status === 'open' && (
                            <ListContextProvider
                                value={{ ...listContext, ids: open }}>
                                <Datagrid optimized rowClick='show'>
                                    <DateField source="createdAt" label="resources.orders.fields.created_at" locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                                    <TextField source="id" label="resources.orders.fields.id" />
                                    <TextField source="companyName" label="resources.orders.fields.pharmacy_name" />
                                    <TextField source="deliveryAddress" label="resources.orders.fields.delivery_address" />
                                    <NumberField 
                                        source="netPrice"
                                        label="resources.orders.fields.total_price"
                                        options={{
                                            style: 'currency',
                                            currency: 'EUR'
                                        }}
                                        sx={{ fontWeight: 'bold' }} />
                                    <TextField source="source" label="resources.orders.fields.source" />
                                    <TextField source="editBy" label="pos.common.edit_by" />
                                    <DateField source="updatedAt" label="resources.orders.fields.updated_at" locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                                </Datagrid>
                            </ListContextProvider>
                        )}
                        {filterValues.status === 'pending' && (
                            <ListContextProvider
                                value={{ ...listContext, ids: pending }}>
                                <Datagrid optimized rowClick='show'>
                                    <DateField source="createdAt" label="resources.orders.fields.created_at" locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                                    <TextField source="id" label="resources.orders.fields.id" />
                                    <TextField source="companyName" label="resources.orders.fields.pharmacy_name" />
                                    <TextField source="deliveryAddress" label="resources.orders.fields.delivery_address" />
                                    <NumberField 
                                        source="netPrice"
                                        label="resources.orders.fields.total_price"
                                        options={{
                                            style: 'currency',
                                            currency: 'EUR'
                                        }}
                                        sx={{ fontWeight: 'bold' }} />
                                    <TextField source="source" label="resources.orders.fields.source" />
                                    <TextField source="editBy" label="pos.common.edit_by" />
                                    <DateField source="updatedAt" label="resources.orders.fields.updated_at" locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                                </Datagrid>
                            </ListContextProvider>
                        )}
                        {filterValues.status === 'done' && (
                            <ListContextProvider
                                value={{ ...listContext, ids: done }}>
                                <Datagrid optimized rowClick='show'>
                                    <DateField source="createdAt" label="resources.orders.fields.created_at" locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                                    <TextField source="id" label="resources.orders.fields.id" />
                                    <TextField source="companyName" label="resources.orders.fields.pharmacy_name" />
                                    <TextField source="deliveryAddress" label="resources.orders.fields.delivery_address" />
                                    <NumberField 
                                        source="netPrice"
                                        label="resources.orders.fields.total_price"
                                        options={{
                                            style: 'currency',
                                            currency: 'EUR'
                                        }}
                                        sx={{ fontWeight: 'bold' }} />
                                    <TextField source="source" label="resources.orders.fields.source" />
                                    <TextField source="editBy" label="pos.common.edit_by" />
                                    <DateField source="updatedAt" label="resources.orders.fields.updated_at" locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                                </Datagrid>
                            </ListContextProvider>
                        )}
                        {filterValues.status === 'cancelled' && (
                            <ListContextProvider
                                value={{ ...listContext, ids: cancelled }}>
                                <Datagrid optimized rowClick='show'>
                                    <DateField source="createdAt" label="resources.orders.fields.created_at" locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                                    <TextField source="id" label="resources.orders.fields.id" />
                                    <TextField source="companyName" label="resources.orders.fields.pharmacy_name" />
                                    <TextField source="deliveryAddress" label="resources.orders.fields.delivery_address" />
                                    <NumberField 
                                        source="netPrice"
                                        label="resources.orders.fields.total_price"
                                        options={{
                                            style: 'currency',
                                            currency: 'EUR'
                                        }}
                                        sx={{ fontWeight: 'bold' }} />
                                    <TextField source="source" label="resources.orders.fields.source" />
                                    <TextField source="editBy" label="pos.common.edit_by" />
                                    <DateField source="updatedAt" label="resources.orders.fields.updated_at" locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                                </Datagrid>
                            </ListContextProvider>
                        )}
                    </>
                ) }
        </Fragment>
    );
};

export default OrderList;
