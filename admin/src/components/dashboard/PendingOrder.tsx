import * as React from 'react';
import {
    ListItem,
    ListItemSecondaryAction,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Box,
    Icon,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslate, useReference } from 'react-admin';
import { Order, User } from '../../types';
import OrderIcon from '@mui/icons-material/AttachMoney';

interface Props {
    order: Order;
}

const currencyFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
});

export const PendingOrder = (props: Props) => {
    const { order } = props;
    const {  } = useTranslate();
    const translate = useTranslate();
    const { referenceRecord: customer, isLoading } = useReference<User>({
        reference: 'users',
        id: order.user,
    });

    return (
        <ListItem button component={Link} to={`/orders/${order.id}`}>
            <ListItemAvatar>
                {isLoading ? (
                    <Avatar />
                ) : (
                    <OrderIcon />
                )}
            </ListItemAvatar>
            <ListItemText
                primary={new Date(order.createdAt).toLocaleString('de-DE')}
                secondary={translate('pos.dashboard.order.items', {
                    smart_count: order.orderItems.length,
                    nb_items: order.orderItems.length,
                    customer_name: customer
                        ? `${customer.nameFirst} ${customer.nameLast}`
                        : '',
                })}
            />
            <ListItemSecondaryAction>
                <Box
                    component="span"
                    sx={{
                        marginRight: '1em',
                        color: 'text.primary',
                    }}
                >
                    {currencyFormatter.format(order.netPrice)}
                </Box>
            </ListItemSecondaryAction>
        </ListItem>
    );
};
