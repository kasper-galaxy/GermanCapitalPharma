import * as React from 'react';
import {
    Avatar,
    Box,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';
import CustomerIcon from '@mui/icons-material/PersonAdd';
import { Link } from 'react-router-dom';
import { useTranslate, useGetList } from 'react-admin';
import { subDays } from 'date-fns';

import CardWithIcon from './CardWithIcon';
import { User } from '../../types';

const NewCustomers = () => {
    const translate = useTranslate();

    const aMonthAgo = subDays(new Date(), 30);
    aMonthAgo.setDate(aMonthAgo.getDate() - 30);
    aMonthAgo.setHours(0);
    aMonthAgo.setMinutes(0);
    aMonthAgo.setSeconds(0);
    aMonthAgo.setMilliseconds(0);

    const { isLoading, data: visitors } = useGetList<User>('users', {
        filter: {
            // has_ordered: true,
            last_seen_gte: aMonthAgo.toISOString(),
        },
        sort: { field: 'lastSeen', order: 'DESC' },
        pagination: { page: 1, perPage: 50 },
    });

    const nb = visitors ? visitors.reduce((nb: number) => ++nb, 0) : 0;
    return (
        <CardWithIcon
            to="/users"
            icon={CustomerIcon}
            title={translate('pos.dashboard.new_customers')}
            subtitle={nb}
        >
            <List sx={{ display: isLoading ? 'none' : 'block' }}>
                {visitors
                    ? visitors.map((record: User) => (
                          <ListItem
                              button
                              to={`/users/${record.id}`}
                              component={Link}
                              key={record.id}
                          >
                              <ListItemAvatar>
                                  <Avatar src={`${record.name}?size=32x32`} />
                              </ListItemAvatar>
                              <ListItemText
                                  primary={`${record.nameFirst} ${record.nameLast}`}
                              />
                          </ListItem>
                      ))
                    : null}
            </List>
            <Box flexGrow={1}>&nbsp;</Box>
            <Button
                sx={{ borderRadius: 0 }}
                component={Link}
                to="/users"
                size="small"
                color="primary"
            >
                <Box p={1} sx={{ color: 'primary.main' }}>
                    {translate('pos.dashboard.all_customers')}
                </Box>
            </Button>
        </CardWithIcon>
    );
};

export default NewCustomers;
