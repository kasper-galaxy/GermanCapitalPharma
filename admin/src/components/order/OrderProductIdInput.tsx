import * as React from 'react';
import PropTypes from 'prop-types';
import { AutocompleteInput, ReferenceInput, useChoicesContext, useNotify, useRecordContext, useRefresh, useTranslate } from 'react-admin';
import { Order, Product } from '../../types';
import { useFormContext } from 'react-hook-form';

const generateId = (index: any, source: any) => {
    return `orderItems.${index}.${source}`;
}

const OrderProductIdAutocompleteInput = ( {...props} ) => {
    const { availableChoices } = useChoicesContext();
    const { setValue } = useFormContext();
    const { index } = props;

    console.log('index child: ', index);

    React.useEffect(() => {
        if (availableChoices) {
            if (availableChoices.length === 1) {
                const choice = availableChoices[0];
                if (choice) {
                    console.log(choice.price);
                    setValue(generateId(index, 'name'), choice.name);
                    setValue(generateId(index, 'price'), choice.price);
                    setValue(generateId(index, 'vat'), choice.vat);
                }
            } else {
                setValue(generateId(index, 'name'), '');
                setValue(generateId(index, 'price'), '');
                setValue(generateId(index, 'vat'), '');
            }
        }
    }, [ availableChoices ]);

    return (<AutocompleteInput
                label='resources.orders.fields.order_item.product'
                optionText={(choice?: Product) =>
                    choice?.id // the empty choice is { id: '' }
                        ? `${choice.id}`
                        : ''
                }
                filterToQuery={search => ({id: search})}
            />);
}

const OrderProductIdInput = ({ ...props }) => {
    const { source, label, reference, ...rest } = props; 
    const index = source.toString().split('.')[1];
    return (
        <ReferenceInput source={source} reference={reference}
            label={label}>
            <OrderProductIdAutocompleteInput index={index} />
        </ReferenceInput>
    );
};

OrderProductIdInput.propTypes = {
    record: PropTypes.any,
    source: PropTypes.any,
    reference: PropTypes.any,
    label: PropTypes.any,
    
};

export default OrderProductIdInput;
