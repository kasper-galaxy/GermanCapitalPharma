import * as React from 'react';
import { Card, CardHeader, CardContent, Box } from '@mui/material';
import { DateInput, Form, SelectInput, SimpleForm, useTranslate } from 'react-admin';
import { Order } from '../../types';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CartesianGrid } from 'recharts';
import { useQuery } from 'react-query';
import myDataProvider from '../../dataProvider/myDataProvider';
import config from '../../config';
import { createVerify } from 'crypto';

const dataProvider = myDataProvider(config.API_URL);

const ChartHeader = (props: CardHeaderProps) => {
    const gteRef = React.useRef<HTMLInputElement>();
    const lteRef = React.useRef<HTMLInputElement>();
    const [status, setStatus] = React.useState('open');
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
        console.log(date_gte, date_lte);
        props.setFrom(date_gte);
        props.setTo(date_lte)
    }
    return (
        <Box display={{ xs: 'block', sm: 'flex', width: '100%', justifyContent: 'space-between' }}>
            <Box mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 1, ml: 1 }}>
                {translate('pos.dashboard.revenue_by_products')}
            </Box>
            <Box mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 1, ml: 1 }}>
                <Form>
                    <SelectInput source="status" choices={[
                        { id: 'pending', name: translate('resources.orders.status.pending') },
                        { id: 'done', name: translate('resources.orders.status.done') },
                        ]}
                        translateChoice
                        emptyValue={'open'}
                        emptyText={translate('resources.orders.status.open')}
                        defaultValue={'open'}
                        sx={{ mr: 1 }}
                        inputProps={{
                            onChange: (evt) => { const { value } = evt.target as HTMLSelectElement; setStatus(value); props.setStatus(value); }
                        }} />
                    <DateInput source="date_gte" label="resources.invoices.fields.date_gte" inputRef={gteRef} sx={{ mr: 1 }} onChange={onDateFilterChange} inputProps={{ max: lteRef.current && lteRef.current?.value }} />
                    <DateInput source="date_lte" label="resources.invoices.fields.date_lte" inputRef={lteRef} sx={{ ml: 1 }} onChange={onDateFilterChange} inputProps={{ min: gteRef.current && gteRef.current?.value }} defaultValue={new Date()} />
                </Form>
            </Box>
        </Box>)
}

const objectToArray = (obj: any) => {
    return Object.keys(obj).map((key: any) => obj[key]);
}

const ProductChart = (props: { orders?: Order[] }) => {
    const { orders } = props;
    const [from, setFrom] = React.useState(null);
    const [to, setTo] = React.useState(null);
    const [status, setStatus] = React.useState('open');
    const [ data, setData ] = React.useState([]);
    const translate = useTranslate();

    React.useEffect(() => {
        console.log('filter change');
        dataProvider.getRevenueByProduct('orders', { from, to, status })
            .then(({ data }) => {
                setData(data);
            })
    }, [from, to, status]);

    return (
        <Card>
            <CardHeader title={<ChartHeader setFrom={setFrom} setTo={setTo} setStatus={setStatus} />} />
            <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                {
                    Object.keys(data).length === 0 ?
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>{translate('pos.dashboard.label_nodata')}</Box>
                        :
                        <ResponsiveContainer>
                            <BarChart
                                data={objectToArray(data)}
                                layout='vertical'>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type='number' name="Revenue" tickFormatter={(v:any) => new Intl.NumberFormat(undefined, {
                                        style: 'currency',
                                        currency: 'EUR',
                                    }).format(v)} />
                                <YAxis dataKey="name" type='category' name='Product' width={100} />
                                <Tooltip
                                    cursor={{ strokeDasharray: '3 3' }}
                                    formatter={(value: any, name: any) =>
                                        [new Intl.NumberFormat(undefined, {
                                            style: 'currency',
                                            currency: 'EUR',
                                        }).format(value),
                                        translate('resources.orders.section.total')
                                        ]
                                    }
                                />
                                <Bar dataKey="cost" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                }
                </div>
            </CardContent>
        </Card>
    );
};

interface CardHeaderProps {
    setFrom: (arg: any) => void,
    setTo: (arg: any) => void,
    setStatus: (arg: any) => void,
}

export default ProductChart;