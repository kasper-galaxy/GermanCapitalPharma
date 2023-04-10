import * as React from 'react';
import { useRecordContext, useTranslate } from 'react-admin';
import { User } from '../../types';
import sirCodes from '../../constants/SelectFields/SirCode';

const OfficialNameField = () => {
    const record = useRecordContext<User>();
    const translate = useTranslate();

    if (!record) {
        return null;
    }
    console.log(record);
    let sirCode = sirCodes[0].name;
    if (record.nameSirCode) {
        const arr = sirCodes.filter(code => code.id === record.nameSirCode);
        if (arr.length > 0) {
            sirCode = arr[0].name;
        } 
    }

    return record ? (
        <span>
            { translate(sirCode)} {record.nameSirTitle}{record.nameSirTitle.length > 0 ? '.' : ''} {record.nameFirst} {record.nameLast}
        </span>
    ) : null;
};

export default OfficialNameField;
