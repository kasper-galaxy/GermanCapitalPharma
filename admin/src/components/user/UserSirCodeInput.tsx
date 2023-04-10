import * as React from 'react';
import { SelectInput, SelectInputProps } from 'react-admin';

import sirCodes from '../../constants/SelectFields/SirCode';

const UserSirCodeInput = (props: SelectInputProps) => {
    let arr = [...sirCodes];
    arr.shift();

    return (<SelectInput
        {...props}
        translateChoice
        choices={arr}
        emptyValue={sirCodes[0].id}
        emptyText={sirCodes[0].name}
    />);
};

export default UserSirCodeInput;
