import * as React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    ReferenceField,
    NumberField,
    DateInput,
    FileField,
    BulkDeleteButton,
    BulkExportButton,
    useTranslate,
} from 'react-admin';
import DownloadInvoiceZip from '../components/invoice/DownloadInvoiceZip';
import FullNameField from '../components/user/FullNameField';
import InvoiceShow from './invoices.show';

const InvoiceBulkActionButtons = React.memo(({ children, ...props }) => (
    <React.Fragment>
        <DownloadInvoiceZip {...props} />
        {/* default bulk delete action */}
        <BulkExportButton {...props} />
        <BulkDeleteButton {...props} />
    </React.Fragment>
));


const InvoiceList = () => {
    const gteRef = React.useRef<HTMLInputElement>();
    const lteRef = React.useRef<HTMLInputElement>();
    const translate = useTranslate();

    const onDateFilterChange = () => {
        const date_gte = gteRef.current ? gteRef.current.value : null;
        const date_lte = lteRef.current ? lteRef.current.value : null;

        if (gteRef && gteRef.current) {
            gteRef.current.max = date_lte || '';
        }
        if (lteRef && lteRef.current) {
            lteRef.current.min = date_gte || '';
        }
    }

    const listFilters = [
        <DateInput source="date_gte" label="resources.invoices.fields.date_gte" inputRef={gteRef} onSelect={onDateFilterChange} />,
        <DateInput source="date_lte" label="resources.invoices.fields.date_lte" inputRef={lteRef} onSelect={onDateFilterChange} />,
    ];
    return (
        <List
            filters={listFilters}
            perPage={25}
            sort={{ field: 'createdAt', order: 'desc' }}
        >
            <Datagrid
                rowClick="expand"
                bulkActionButtons={<InvoiceBulkActionButtons />}
                expand={<InvoiceShow />}
                sx={{
                    '& .column-customer_id': {
                        display: { xs: 'none', md: 'table-cell' },
                    },
                    '& .column-total_ex_taxes': {
                        display: { xs: 'none', md: 'table-cell' },
                    },
                    '& .column-delivery_fees': {
                        display: { xs: 'none', md: 'table-cell' },
                    },
                    '& .column-taxes': {
                        display: { xs: 'none', md: 'table-cell' },
                    },
                }}
            >
                <TextField source="id" label="resources.invoices.fields.id" />
                <DateField source="createdAt" label="resources.invoices.fields.created_at" locales={'en-GB'} options={{ month:'2-digit', day:'2-digit', year:'numeric' }} />
                <ReferenceField source="user" reference="users" link={'show'}>
                    <FullNameField />
                </ReferenceField>
                <TextField source="address" label="resources.invoices.fields.delivery_address" />
                <ReferenceField source="order" reference="orders" link={'show'}>
                    <TextField source="id" label="resources.invoices.fields.order" />
                </ReferenceField>
                <FileField source="url" target="_blank" title={translate('resources.orders.actions.open')}/>
                <NumberField source="taxPrice" label="resources.invoices.fields.tax_price" options={{
                            style: 'currency',
                            currency: 'EUR'
                        }} />
                <NumberField source="netPrice" label="resources.invoices.fields.total_price" options={{
                            style: 'currency',
                            currency: 'EUR'
                        }} />
            </Datagrid>
        </List>
    );
};

export default InvoiceList;
