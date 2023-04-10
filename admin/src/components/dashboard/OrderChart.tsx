import * as React from 'react';
import { Card, CardHeader, CardContent, Box } from '@mui/material';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { DateInput, Form, SelectInput, useTranslate } from 'react-admin';
import { format, subDays, addDays } from 'date-fns';
import { Order } from '../../types';


const lastDay = new Date();
const lastMonthDays = Array.from({ length: 30 }, (_, i) => subDays(lastDay, i));
const aMonthAgo = subDays(new Date(), 30);

const dateFormatter = (date: number): string =>
    new Date(date).toLocaleDateString().slice(0, -5).concat('.');

const aggregateOrdersByDay = (orders: Order[]): { [key: string]: number } =>
    orders
        .filter((order: Order) => order.status !== 'cancelled')
        .reduce((acc, curr) => {
            const day = format(new Date(curr.createdAt), 'yyyy-MM-dd');
            if (!acc[day]) {
                acc[day] = 0;
            }
            acc[day] += curr.netPrice;
            return acc;
        }, {} as { [key: string]: number });

const getRevenuePerDay = (orders: Order[]): TotalByDay[] => {
    const daysWithRevenue = aggregateOrdersByDay(orders);
    return lastMonthDays.map(date => ({
        date: date.getTime(),
        total: daysWithRevenue[format(new Date(date), 'yyyy-MM-dd')] || 0,
    }));
};

const ChartHeader = (props: CardHeaderProps) => {
    const translate = useTranslate();
    const [status, setStatus] = React.useState('open');

    return (
        <Box display={{ xs: 'block', sm: 'flex', width: '100%', justifyContent: 'space-between' }}>
            <Box mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                {translate('pos.dashboard.month_history')}
            </Box>
            <Box mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
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
                </Form>
            </Box>
        </Box>)
}

const OrderChart = (props: { orders?: Order[] }) => {
    const { orders } = props;
    const translate = useTranslate();
    const [status, setStatus] = React.useState('open');
    if (!orders) return null;
    console.log(getRevenuePerDay(orders));

    return (
        <Card>
            <CardHeader title={<ChartHeader setStatus={setStatus} />} />
            <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                    {
                        orders.length === 0 ?
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>{translate('pos.dashboard.label_nodata')}</Box>
                            :
                            <ResponsiveContainer>
                                <AreaChart data={getRevenuePerDay(orders.filter((order) => order.status === status))}>
                                    <defs>
                                        <linearGradient
                                            id="colorUv"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#8884d8"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#8884d8"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date"
                                        name="Date"
                                        type="number"
                                        scale="time"
                                        domain={[
                                            addDays(aMonthAgo, 1).getTime(),
                                            new Date().getTime(),
                                        ]}
                                        tickFormatter={dateFormatter}
                                    />
                                    <YAxis dataKey="total" name="Revenue" width={120} tickFormatter={(v:any) => new Intl.NumberFormat(undefined, {
                                        style: 'currency',
                                        currency: 'EUR',
                                    }).format(v)}/>
                                    <CartesianGrid strokeDasharray="3 3" />
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
                                        labelFormatter={(label: any) =>
                                            dateFormatter(label)
                                        }
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        fill="url(#colorUv)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                    }
                </div>
            </CardContent>
        </Card>
    );
};

interface TotalByDay {
    date: number;
    total: number;
}

interface CardHeaderProps {
    setStatus: (arg: any) => void,
}

export default OrderChart;
