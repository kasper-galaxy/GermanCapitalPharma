import * as React from 'react';
import PropTypes from 'prop-types';
import { AutocompleteInput, ReferenceInput, useChoicesContext, useGetOne, useNotify, useRecordContext, useRefresh, useTranslate } from 'react-admin';
import { Order, User } from '../../types';
import { useFormContext } from 'react-hook-form';

const OrderUserIdInput = ( {...props} ) => {
    const { selectedChoices } = useChoicesContext();
    const { setValue } = useFormContext();

    React.useEffect(() => {
        if (selectedChoices && selectedChoices.length === 1) {
            const choice = selectedChoices[0];
            if (choice) {
                console.log('choice', choice?.companyName);
                setValue('companyName', choice?.companyName);
                setValue('deliveryAddress', choice?.addressStreet + ' ' + choice?.addressHouse + ', ' + choice?.addressZipCode + ' ' + choice?.addressCity);
            }
        }
    }, [ selectedChoices ]);

    return (<AutocompleteInput
                optionText={(choice?: User) =>
                    choice?.id // the empty choice is { id: '' }
                        ? `${choice.id}`
                        : ''
                }
                filterToQuery={search => ({id: search})}
            />);
}

OrderUserIdInput.propTypes = {
    record: PropTypes.any
};

export default OrderUserIdInput;
