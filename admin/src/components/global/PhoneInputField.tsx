import * as React from "react";
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css'
import de from 'react-phone-input-2/lang/de.json';
import { useRecordContext } from 'react-admin';
import startsWith from 'lodash/startsWith';
import { User } from "../../types";

const PhoneInputField = ({...props}) => {
    const record = useRecordContext<User>();
    const [phone, setPhone] = React.useState('');
    const { source, label } = props;

    console.log(source, label);
    return (  
        <PhoneInput
            country='de'
            localization={de}
            onChange={v => setPhone(v)}
            value={phone}
            placeholder={label}
            
            inputStyle={{
                width: "100%",
                height: "48px",
                marginTop: "8px",
            }} 
            buttonStyle={{
                marginTop: "8px"
            }}

            isValid={(inputNumber, country, countries) => {
                return countries.some((country: any) => {
                  return startsWith(inputNumber, country.dialCode) || startsWith(country.dialCode, inputNumber);
                });
              }}
        />);
};

PhoneInputField.propTypes = {
    source: PropTypes.string,
    label: PropTypes.string
};

export default PhoneInputField;