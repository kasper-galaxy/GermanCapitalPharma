import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { FileField, FileInput, FileInputProps, useRecordContext } from 'react-admin';
import { User } from '../../types';
import { KEY_LICENSE_DOCUMENT_APPROVED } from '../../constants/SelectFields/LicenseStatusKey';

const LicenseFileInput = (props: FileInputProps) => {
    const record = useRecordContext<User>();
    const { source } = props;
    console.log('user license file input ', props, record);
    const file = source === 'businessLicense' ? record.businessLicense : record.officialDocument;
    const fileState = source === 'businessLicense' ? record.businessLicenseState : record.officialDocumentState;

    return record.userVerified || fileState === KEY_LICENSE_DOCUMENT_APPROVED ? ( 
            file ? <FileField source={file.url} title="Open" target="_blank" label='resources.users.fields.official_document'  /> : <span />
        ) : 
        ( 
            <FileInput
                {...props}
                accept=".pdf,.png,.jpg"
                maxSize={10000000}
            >
                <FileField source="url" title="title" src="url" target="_blank"  />
            </FileInput> 
     );
}

LicenseFileInput.propTypes = {
    record: PropTypes.any
};

export default LicenseFileInput;
