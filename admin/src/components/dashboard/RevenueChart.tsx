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
import { DateInput, Form, NumberInput, SelectField, SelectInput, useTranslate } from 'react-admin';
import { format, subDays, addDays } from 'date-fns';
import { Order } from '../../types';
import myDataProvider from '../../dataProvider/myDataProvider';
import config from '../../config';

const dataProvider = myDataProvider(config.API_URL);
const getWeekNumber = (date: any) => {
    var d: any = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart: any = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
  };
  
const getDaysArray = function(s: any,e: any) {for(var a=[],d=new Date(s);d<=new Date(e);d.setDate(d.getDate()+1)){ a.push(new Date(d));}return a;};

const dateFormatter = (date: number): string =>
    new Date(date).toLocaleDateString().slice(0, -5).concat('.');

const aggregateOrdersByWeek = (data: RevenueWeekType[]): { [key: string]: number } =>
    data.reduce((acc, curr) => {
            const week = `${curr._id}`;
            if (!acc[week]) {
                acc[week] = 0;
            }
            acc[week] += curr.total;
            return acc;
        }, {} as { [key: string]: number });

const aggregateOrdersByDay = (data: RevenueDateType[]): { [key: string]: number } =>
    data.reduce((acc, curr) => {
            const day = new Date(curr._id).toISOString().slice(0, 10);
            if (!acc[day]) {
                acc[day] = 0;
            }
            acc[day] += curr.total;
            return acc;
        }, {} as { [key: string]: number });

const getRevenuePerDay = (data: RevenueDateType[], from: any, to: any) => {
    if (data.length == 0)
        return [];
    const daysWithRevenue = aggregateOrdersByDay(data);
    
    const start = subDays(new Date(from || data[0]._id), 2);
    const end = addDays(new Date(to || data[data.length-1]._id), 2);
    const periodDays = getDaysArray(start, end);

    return periodDays.map(date => ({
        date: date.getTime(),
        total: daysWithRevenue[format(new Date(date), 'yyyy-MM-dd')] || 0,
    }));
};

const getRevenuePerWeek = (data: RevenueWeekType[], from: any, to: any) => {
    if (data.length == 0)
        return [];
    const weeksWithRevenue = aggregateOrdersByWeek(data);
    const start = Number(from);
    const end = Number(to);
    const periodDays = Array.from({length: (end - start + 1)}, (v, k) => k + start);

    return periodDays.map(date => ({
        date: `${date}`,
        total: weeksWithRevenue[`${date}`] || 0,
    }));
};

const ChartHeader = (props: CardHeaderProps) => {
    const gteRef = React.useRef<HTMLInputElement>();
    const lteRef = React.useRef<HTMLInputElement>();
    const gteWeekRef = React.useRef<HTMLInputElement>();
    const lteWeekRef = React.useRef<HTMLInputElement>();
    const [isDate, setIsDate] = React.useState(true);
    const [status, setStatus] = React.useState('open');
    const translate = useTranslate();
    const onDateFilterChange = () => {
        const date_gte = gteRef.current ? gteRef.current.value : null;
        const date_lte = lteRef.current ? format(addDays(new Date(lteRef.current.value), 2), 'yyyy-MM-dd') : null;

        if (gteRef && gteRef.current) {
            gteRef.current.max = date_lte || '';
        }
        if (lteRef && lteRef.current) {
            lteRef.current.min = date_gte || '';
        }
        props.setFrom(date_gte);
        props.setTo(date_lte)
    };
    const onWeekFilterChange = () => {
        const week_gte = gteWeekRef.current ? gteWeekRef.current.value : null;
        const week_lte = lteWeekRef.current ? lteWeekRef.current.value : null;

        if (gteWeekRef && gteWeekRef.current) {
            gteWeekRef.current.max = week_lte || '';
        }
        if (lteWeekRef && lteWeekRef.current) {
            lteWeekRef.current.min = week_gte || '';
        }
        props.setFromWeek(week_gte);
        props.setToWeek(week_lte)
    };
    React.useEffect(() => {
        if (isDate) {
            onDateFilterChange();
        } else {
            onWeekFilterChange();
        }
    }, [isDate, onDateFilterChange, onWeekFilterChange]);


    return (
        <Box display={{ xs: 'block', sm: 'flex', width: '100%', justifyContent: 'space-between' }}>
            <Box mr={{ xs: 0, sm: '0.5em' }} sx={{ mr: 2, ml: 2 }}>
                {translate('pos.dashboard.monthly_revenue')}
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
                            sx={{ ml: 2, mr: 2 }}
                            inputProps={{
                                onChange: (evt) => { const { value } = evt.target as HTMLSelectElement; setStatus(value); props.setStatus(value); }
                            }} />
                    <SelectInput source="type" choices={[
                        { id: 'W', name: translate('pos.dashboard.option_week') },
                        ]}
                        translateChoice
                        emptyValue={'M'}
                        emptyText={translate('pos.dashboard.option_date')}
                        defaultValue={'M'}
                        inputProps={{
                            onChange: (evt) => { const { value } = evt.target as HTMLSelectElement; setIsDate(value === 'M'); props.setIsDate(value === 'M'); }
                        }} />
                        { isDate ?
                            <><DateInput source="date_gte" label="resources.invoices.fields.date_gte" inputRef={gteRef} sx={{ ml: 2 }} onChange={onDateFilterChange} inputProps={{ max: lteRef.current && lteRef.current?.value }} />
                            <DateInput source="date_lte" label="resources.invoices.fields.date_lte" inputRef={lteRef} sx={{ ml: 2 }} onChange={onDateFilterChange} inputProps={{ min: gteRef.current && gteRef.current?.value }} defaultValue={new Date()} /></>
                            :
                            <><NumberInput source="week_gte" label="resources.invoices.fields.date_gte" inputRef={gteWeekRef} sx={{ ml: 2 }} onChange={onWeekFilterChange} inputProps={{ max: lteWeekRef.current && lteWeekRef.current?.value }} />
                            <NumberInput source="week_lte" label="resources.invoices.fields.date_lte" inputRef={lteWeekRef} sx={{ mr: 2 }} onChange={onWeekFilterChange} inputProps={{ min: gteWeekRef.current && gteWeekRef.current?.value }} defaultValue={getWeekNumber(new Date())} /></>
                          }
                        
                </Form>
            </Box>
        </Box>)
}

const objectToArray = (obj: any) => {
    return Object.keys(obj).map((key: any) => obj[key]);
}

const RevenueChart = (props: { orders?: Order[] }) => {
    const { orders } = props;
    const [from, setFrom] = React.useState(null);
    const [to, setTo] = React.useState(null);
    const [fromWeek, setFromWeek] = React.useState(null);
    const [toWeek, setToWeek] = React.useState(null);
    const [isDate, setIsDate] = React.useState(true);
    const [status, setStatus] = React.useState('open');
    const [ data, setData ] = React.useState([]);
    const translate = useTranslate();
    
    React.useEffect(() => {
        if (isDate) {
            dataProvider.getRevenueByDate('orders', { from, to, isDate, status })
                .then(({ data }) => {
                    console.log('response  date << ', from, to, data)
                    setData(data);
                })
        } else {
            dataProvider.getRevenueByDate('orders', { fromWeek, toWeek, isDate, status })
            .then(({ data }) => {
                console.log('response  weed << ', data)
                setData(data);
            })
        }
    }, [from, to, fromWeek, toWeek, isDate, status]);
    
    React.useEffect(()=> {
        console.log('data  << ', data)
        if (data) {
            isDate ? getRevenuePerDay(objectToArray(data), from, to) : getRevenuePerWeek(objectToArray(data), fromWeek, toWeek);
        }
    }, [data]);

    return (
        <Card>
            <CardHeader title={<ChartHeader setFrom={setFrom} setTo={setTo} setFromWeek={setFromWeek} setToWeek={setToWeek} setIsDate={setIsDate} setStatus={setStatus} />} />
            <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                {
                    Object.keys(data).length === 0 ?
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>{translate('pos.dashboard.label_nodata')}</Box>
                    :
                    <ResponsiveContainer>
                        <AreaChart data={isDate ? getRevenuePerDay(objectToArray(data), from, to) : getRevenuePerWeek(objectToArray(data), fromWeek, toWeek)}>
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
                            {isDate ? 
                                <XAxis
                                    dataKey="date"
                                    name="Date"
                                    type="number"
                                    scale="time"
                                    domain={[
                                        getRevenuePerDay(objectToArray(data), from, to)[0].date,
                                        getRevenuePerDay(objectToArray(data), from, to).at(-1)!.date,
                                    ]}
                                    tickFormatter={dateFormatter}
                                /> : 
                                <XAxis
                                    dataKey="date"
                                    name="Date"
                                />}
                            <YAxis dataKey="total" name="Revenue" width={120} tickFormatter={(v:any) => new Intl.NumberFormat(undefined, {
                                        style: 'currency',
                                        currency: 'EUR',
                                    }).format(v)} />
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
                                    isDate ? dateFormatter(label) : `${translate('pos.dashboard.label_week')} ${label}`
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

interface RevenueDateType {
    _id: string,
    total: number,
}

interface RevenueWeekType {
    _id: number,
    total: number,
}

interface CardHeaderProps {
    setFrom: (arg: any) => void,
    setTo: (arg: any) => void,
    setFromWeek: (arg: any) => void,
    setToWeek: (arg: any) => void,
    setIsDate: (arg: any) => void,
    setStatus: (arg: any) => void,
}

export default RevenueChart;
