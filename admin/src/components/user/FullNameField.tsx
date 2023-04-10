import * as React from 'react';
import { useRecordContext } from 'react-admin';
import { User } from '../../types';

const FullNameField = () => {
    const record = useRecordContext<User>();

    return record ? (
        <span>
            {record.nameFirst} {record.nameLast}
        </span>
    ) : null;
};

export default FullNameField;
