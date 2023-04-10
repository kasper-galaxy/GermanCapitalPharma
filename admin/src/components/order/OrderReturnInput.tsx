import * as React from 'react';
import PropTypes from 'prop-types';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import GppBadIcon from '@mui/icons-material/GppBad';
import Button from '@mui/material/Button';
import { useNotify, useRecordContext, useRefresh, useTranslate } from 'react-admin';
import { Order } from '../../types';
import { useFormContext } from 'react-hook-form';

const OrderReturnInput = ( {...props} ) => {
    const translate = useTranslate();
    const notify = useNotify();
    const refresh = useRefresh();
    const record = useRecordContext<Order>();
    const { setValue } = useFormContext();
    const [ cancelled, setCancelled ] = React.useState(record.cancelled);
    
    const cancelledHandler = () => {
        if (cancelled) { // Set to FALSE
            setValue('cancelled', false);
            setCancelled(false);
        } else {                    // Set to TRUE
            setValue('cancelled', true);
            setCancelled(true);
        }
    }

    return !cancelled ? (
        <Button
            variant="outlined"
            color="error"
            size="medium"
            onClick={() => cancelledHandler()}
            startIcon={<GppBadIcon sx={{ color: 'red' }} />}
        >
            {translate('resources.orders.actions.return')}
        </Button>
        ) : (
            <Button
                variant="outlined"
                color="success"
                size="medium"
                onClick={() => cancelledHandler()}
                startIcon={<FactCheckIcon sx={{ color: 'green' }} />}
                >
                {translate('resources.orders.actions.cancel_return')}
            </Button>
        );
}

OrderReturnInput.propTypes = {
    record: PropTypes.any,
};

export default OrderReturnInput;
