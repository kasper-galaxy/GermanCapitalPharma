import * as React from 'react';
import { Card, CardContent } from '@mui/material';
import { Button, FilterList, FilterListItem, FilterLiveSearch, useListFilterContext } from 'react-admin';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOnOutlined';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import BlockIcon from '@mui/icons-material/Block';
import { ClearAll } from '@mui/icons-material';
import {
    endOfYesterday,
    startOfWeek,
    subWeeks,
    startOfMonth,
    subMonths,
} from 'date-fns';

const UserListAside = () => {
    const { setFilters, displayedFilters } = useListFilterContext();

    return (
    <Card
        sx={{
            display: {
                xs: 'none',
                md: 'block',
            },
            order: -1,
            flex: '0 0 15em',
            mr: 2,
            mt: 8,
            alignSelf: 'flex-start',
        }}>
        <CardContent sx={{ pt: 1}}>
            <FilterLiveSearch />

            {/* <FilterList
                label="resources.users.filters.last_visited"
                icon={<AccessTimeIcon />}>
                <FilterListItem
                    label="resources.users.filters.today"
                    value={{
                        last_seen_gte: endOfYesterday().toISOString(),
                        last_seen_lte: undefined,
                    }}
                />
                <FilterListItem
                    label="resources.users.filters.this_week"
                    value={{
                        last_seen_gte: startOfWeek(new Date()).toISOString(),
                        last_seen_lte: undefined,
                    }}
                />
                <FilterListItem
                    label="resources.users.filters.last_week"
                    value={{
                        last_seen_gte: subWeeks(
                            startOfWeek(new Date()),
                            1
                        ).toISOString(),
                        last_seen_lte: startOfWeek(new Date()).toISOString(),
                    }}
                />
                <FilterListItem
                    label="resources.users.filters.this_month"
                    value={{
                        last_seen_gte: startOfMonth(new Date()).toISOString(),
                        last_seen_lte: undefined,
                    }}
                />
                <FilterListItem
                    label="resources.users.filters.last_month"
                    value={{
                        last_seen_gte: subMonths(
                            startOfMonth(new Date()),
                            1
                        ).toISOString(),
                        last_seen_lte: startOfMonth(new Date()).toISOString(),
                    }}
                />
                <FilterListItem
                    label="resources.users.filters.earlier"
                    value={{
                        last_seen_gte: undefined,
                        last_seen_lte: subMonths(
                            startOfMonth(new Date()),
                            1
                        ).toISOString(),
                    }}
                />           
            </FilterList>

            <FilterList
                label="resources.users.filters.has_ordered"
                icon={<MonetizationOnIcon />}
            >
                <FilterListItem
                    label="ra.boolean.true"
                    value={{
                        nb_commands_gte: 1,
                        nb_commands_lte: undefined,
                    }}
                />
                <FilterListItem
                    label="ra.boolean.false"
                    value={{
                        nb_commands_gte: undefined,
                        nb_commands_lte: 0,
                    }}
                />
            </FilterList> */}

            <FilterList
                label="resources.users.filters.is_verified"
                icon={<AssuredWorkloadIcon />}
            >
                <FilterListItem
                    label="ra.boolean.true"
                    value={{ userVerified: true }}
                />
                <FilterListItem
                    label="ra.boolean.false"
                    value={{ userVerified: false }}
                />
            </FilterList>

            <FilterList
                label="resources.users.filters.is_freezed"
                icon={<BlockIcon />}
            >
                <FilterListItem
                    label="ra.boolean.true"
                    value={{ userFreezed: true }}
                />
                <FilterListItem
                    label="ra.boolean.false"
                    value={{ userFreezed: false }}
                />
            </FilterList>

            <Button
                label="resources.users.filters.clear_filter"
                size='medium'
                color='primary'
                startIcon={<ClearAll />}
                onClick={() => setFilters({}, displayedFilters)}
                />

        </CardContent>

        
    </Card>
    );
}

export default UserListAside;