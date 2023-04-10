import React, { useMemo, CSSProperties } from 'react';
import { Theme, useMediaQuery } from '@mui/material';
import { useGetList } from 'react-admin';
import { Order } from '../types';
import { startOfDay, subDays } from 'date-fns';
import MonthlyRevenue from '../components/dashboard/MonthlyRevenue';
import NbNewOrders from '../components/dashboard/NbNewOrders';
import PendingOrders from '../components/dashboard/PendingOrders';
import NewCustomers from '../components/dashboard/NewCustomers';
import NewProducts from '../components/dashboard/NewProducts';
import OrderChart from '../components/dashboard/OrderChart';
import ProductChart from '../components/dashboard/ProductChart';
import RevenueChart from '../components/dashboard/RevenueChart';

interface OrderStats {
    revenue: number;
    nbNewOrders: number;
    pendingOrders: Order[];
}

interface State {
    nbNewOrders?: number;
    pendingOrders?: Order[];
    recentOrders?: Order[];
    revenue?: string;
}

const styles = {
    flex: { display: 'flex' },
    flexColumn: { display: 'flex', flexDirection: 'column' },
    leftCol: { flex: 1, marginRight: '0.5em' },
    middleCol: { flex: 1, marginLeft: '0.5em', marginRight: '0.5em' },
    rightCol: { flex: 1, marginLeft: '0.5em' },
    singleCol: { marginTop: '1em', marginBottom: '1em' },
};

const Spacer = () => <span style={{ width: '1em' }} />;
const VerticalSpacer = () => <span style={{ height: '1em' }} />;

const Dashboard = () => {
    const isXSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );
    const isSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('lg')
    );

    const aMonthAgo = useMemo(() => subDays(startOfDay(new Date()), 30), []);

    const { data: orders } = useGetList<Order>('orders', {
        filter: { date_gte: aMonthAgo.toISOString() },
        sort: { field: 'updatedAt', order: 'DESC' },
        pagination: { page: 1 , perPage: 9999},
    });

    const aggregation = useMemo<State>(() => {
        if (!orders) {
            return {};
        }
        const aggregations = orders
            .filter(order => order.status !== 'cancelled')
            .reduce(
                (stats: OrderStats, order) => {
                    if (order.status !== 'cancelled') {
                        stats.revenue += order.netPrice;
                        stats.nbNewOrders ++;
                    }
                    if (order.status === 'open') {
                        stats.pendingOrders.push(order);
                    }
                    return stats;
                },
                {
                    revenue: 0,
                    nbNewOrders: 0,
                    pendingOrders: []
                }
            );
        return {
            recentOrders: orders,
            revenue: aggregations.revenue.toLocaleString(undefined, {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }),
            nbNewOrders: aggregations.nbNewOrders,
            pendingOrders: aggregations.pendingOrders,
        };
    }, [orders]);

    const { nbNewOrders, pendingOrders, revenue, recentOrders } = aggregation;

    return isXSmall ? (
        <div>
            <div style={styles.flexColumn as CSSProperties}>

            </div>
        </div>
    ) : isSmall ? (
        <div style={styles.flexColumn as CSSProperties}>

        </div>
    ) : (
        <>
        <VerticalSpacer />
        <div style={styles.flex}>
            <div style={styles.leftCol}>
                <div style={styles.singleCol}>
                    <OrderChart orders={recentOrders} />
                </div>
            </div>
            <div style={styles.rightCol}>
                <div style={styles.singleCol}>
                    <ProductChart orders={recentOrders} />
                </div>
            </div>
        </div>
        <div style={styles.singleCol}>
            <RevenueChart orders={recentOrders} />
        </div>
        <div style={styles.flex}>
            <div style={styles.leftCol}>
                <div style={styles.flex}>
                    <MonthlyRevenue value={revenue} />
                    <Spacer />
                    <NbNewOrders value={nbNewOrders} />
                </div>
                <div style={styles.singleCol}>
                    <PendingOrders orders={pendingOrders} />
                </div>
            </div>
            <div style={styles.rightCol}>
                <div style={styles.flex}>
                    <NewCustomers />
                    <Spacer />
                    <NewProducts />
                </div>
            </div>
        </div>
        <VerticalSpacer />
        </>
    );
};

export default Dashboard;