import * as React from 'react';
import { useRecordContext } from 'react-admin';
import { useTranslate } from 'react-admin';

const DescriptionField = () => {
    const record = useRecordContext();
    const translate = useTranslate();

    let description;
    if (record.type == 0)
        description = translate("resources.notifications.alarm.newUserCreated");
    else if (record.type == 1)
        description = translate("resources.notifications.alarm.newOrderCreated");
    else if (record.type == 2)
        description = translate("resources.notifications.alarm.UserUpdated");
    return record ? (
        <span>
            {record.description} - {description}
        </span>
    ) : null;
}

export default DescriptionField;