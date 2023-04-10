import * as React from 'react';
import PropTypes from 'prop-types';
import { useRecordContext, useTranslate } from 'react-admin';
import { User } from '../../types';
import statusCodes from '../../constants/SelectFields/LicenseStatus';

const LicenseStateField = ({...props}) => {
    const record = useRecordContext<User>();
    const translate = useTranslate();
    const { source } = props;

    if (!record) {
        return null;
    }

    console.log(source, record[source]);
    const state = statusCodes.filter((code) => {
        return code.id === record[source];
    })[0];

    console.log(state);

    return (
        <span>
            {state && translate(state.name)}
        </span>
    );
};

LicenseStateField.propTypes = {
    record: PropTypes.any,
    source: PropTypes.any,
};

export default LicenseStateField;
