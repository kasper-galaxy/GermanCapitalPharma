import { Checkbox } from '@mui/material';
import PropTypes from 'prop-types';
import * as React from 'react';
import { BooleanInput, useRecordContext } from 'react-admin';
import { Order } from '../../types';
import { useFormContext } from 'react-hook-form';

const OrderDeliveredInput = ({... props}) => {
    const record = useRecordContext<Order>();
    const { setValue } = useFormContext();    
    const { canDeliveryCheck } = props;

    return (
        <Checkbox   
            defaultChecked={record ? record.deliveryStatus === 'done': false}
            onChange={event => setValue('deliveryStatus', event.target.checked ? 'done' : 'open')}
            disabled={!canDeliveryCheck}
        />
    );
};

OrderDeliveredInput.propTypes = {
    canDeliveryCheck: PropTypes.any,
};

export default OrderDeliveredInput;
