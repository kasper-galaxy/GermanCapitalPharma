import * as React from 'react';
import { useRecordContext } from 'react-admin';
import { User } from '../../types';

const AddressField = () => {
    const record = useRecordContext<User>();

    return record ? (
        <span>
            {record.addressStreet+' '} {record.addressHouse }, {record.addressZipCode + ' '} {record.addressCity}
        </span>
    ) : null;
};

export default AddressField;
