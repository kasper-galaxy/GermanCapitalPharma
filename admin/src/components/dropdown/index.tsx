import React, { useState, useEffect, useRef } from 'react';
import DropdownButton from 'react-bootstrap/DropdownButton';
import config from '../../config';
import DropDownItem from './DropDownItem';
import  io  from 'socket.io-client';
import { Store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { useTranslate } from 'react-admin';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import myDataProvider from '../../dataProvider/myDataProvider';
import { Badge } from '@mui/material';

const dataProvider = myDataProvider(config.API_URL);
const MenuAlignEndExample = () => {
  const [notifications, setNotifications] = useState([]);
  const translate = useTranslate();
  let iconColor;
  useEffect(() => {
      const socket = io();
      socket.on('connect', () => {
        console.log("Server Connected!", socket.id);
      });
      socket.on('disconnected', () => {
        socket.disconnect();
      });
      socket.on('message', data => {
      });
      socket.on('new_user_created', data => {
          Store.addNotification({
              title: `${ translate('resources.notifications.alarm.newUserCreated') }`,
              message: `${data.email}`,
              type: "info",
              insert: "top",
              container: "top-right",
              animationIn: ["animate__animated", "animate__fadeIn"],
              animationOut: ["animate__animated", "animate__fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: true
              },
              onRemoval: (id, removedBy) => {
                  if (removedBy == 'click') {
                    dataProvider.update_visit(data.email);
                    window.location.href = `#/users/${data.id}/show`;
                  }
              }
          });
      });
      socket.on('new_order_created', data => {
          Store.addNotification({
              title: `${ translate('resources.notifications.alarm.newOrderCreated') }`,
              message: `${data.email}`,
              type: "info",
              insert: "top",
              container: "top-right",
              animationIn: ["animate__animated", "animate__fadeIn"],
              animationOut: ["animate__animated", "animate__fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: true
              },
              onRemoval: (id, removedBy) => {
                  if (removedBy == 'click') {
                    dataProvider.update_visit(data.email);
                    window.location.href = `#/users/${data.id}/show`;
                  }
              }
          });
      });
      socket.on('notification_updated', data => {
        dataProvider.get_dropdown_list()
          .then(({data}) => {
            setNotifications(data);
          });
      });
      socket.on('user_updated', data => {
        Store.addNotification({
            title: `${ translate('resources.notifications.alarm.UserUpdated') }`,
            message: `${data.email}`,
            type: "info",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            },
            onRemoval: (id, removedBy) => {
                if (removedBy == 'click') {
                  dataProvider.update_visit(data.email);
                  window.location.href = `#/users/${data.id}/show`;
                }
            }
        });
    });
      return () => {
        socket.disconnect();
        socket.off('connect');
        socket.off('disconnect');
        socket.off('message');
      };
  });

  useEffect(() => {
    dataProvider.get_dropdown_list()
      .then(({data}) => {
        setNotifications(data);
      });
  }, []);
  let new_no = notifications.map((record:any) => record.visited == true);
  let badgeCount = notifications.filter((record:any) => record.visited == false).length;
  iconColor = new_no.indexOf(false) >= 0 ? "#6f42c1" : "#6c757d";
  
  return (
    <DropdownButton
      align="end"
      // title={translate("resources.notifications.name")}
      title={
        <Badge badgeContent={badgeCount} color="primary">
          <NotificationsNoneIcon style={{ color:`${iconColor}` }} />
        </Badge>
      
      } // #6f42c1
      id="dropdown-menu-align-end"
      variant="basic"
    >
      { notifications && notifications.map((record : any) => (
        <DropDownItem email = {record.user} type={record.type} id={record.ref_id} visited={record.visited} createdAt={record.createdAt} />
      ))}      
    </DropdownButton>
  );
}

export default MenuAlignEndExample;