import * as React from 'react';
import { useRecordContext } from 'react-admin';
import { User } from '../../types';

const SirTitleField = () => {
    const record = useRecordContext<User>();

    return record && record.nameSirTitle.length > 0 ? (
        <span>
            {record.nameSirTitle}{'. '}
        </span>
    ) : null;
};

export default SirTitleField;
