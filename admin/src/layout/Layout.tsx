import * as React from 'react';
import { Layout, LayoutProps } from 'react-admin';
import { ReactQueryDevtools } from 'react-query/devtools';
import AppBar from './AppBar';
import Menu from './Menu';

export default (props: LayoutProps) => {
    return <>
        <Layout {...props} appBar={AppBar} menu={Menu} style={{paddingTop: 24}} />
        <ReactQueryDevtools 
            initialIsOpen={false}
            toggleButtonProps={{ style: { width: 20, height: 30 } }}/>
    </>;
};
