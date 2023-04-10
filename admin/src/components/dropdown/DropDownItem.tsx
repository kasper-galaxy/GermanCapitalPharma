import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
// import { ClearIcon, CheckIcon } from '@material-ui/icons';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useDataProvider, useTranslate } from "react-admin";

const DropDownItem = (props:any) => {
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const handle = (e:any) => {
        dataProvider.update_visit(props.email);
    }
    const url = props.type == 0 ? `#/users/${props.id}/show` : `#/orders/${props.id}/show`;
    let description;
    if (props.type == 0)
        description = translate('resources.notifications.alarm.newUserCreated');
    else if (props.type == 1)
        description = translate('resources.notifications.alarm.newOrderCreated');
    else if (props.type == 2)
        description = translate('resources.notifications.alarm.UserUpdated');
    return (
        <>
            <Dropdown.Item href={url} onClick={handle}>
                <div style={{ display: "flex" }}>
                    <div style={{ width: "500px", textAlign: "center" }}>{props.email} - {description}</div>
                    <div style={{ marginRight: "1rem" }}>{props.createdAt}</div>
                    <div>{ props.visited ? <MarkEmailReadIcon color="success" /> : <MarkEmailUnreadIcon sx={{ color: "red" }}/> }</div>                    
                </div>
                {/* { props.visited ?  } */}
            </Dropdown.Item>
        </>
    );
};

export default DropDownItem;