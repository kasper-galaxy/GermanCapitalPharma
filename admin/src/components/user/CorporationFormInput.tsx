import * as React from 'react';
import { SelectInput, SelectInputProps } from 'react-admin';

import corporationFormCodes from '../../constants/SelectFields/CorporationForm';

const CorporationFormInput = (props: SelectInputProps) => (
    <SelectInput
        {...props}
        translateChoice
        choices={corporationFormCodes}
        emptyValue={null}
    />
);

export default CorporationFormInput;
