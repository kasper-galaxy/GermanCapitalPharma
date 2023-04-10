import * as React from 'react';
import { Admin, CustomRoutes, Resource, ListGuesser, EditGuesser, ShowGuesser,  } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { Route } from 'react-router';
import dataProvider from './dataProvider';
import authProvider from './authProvider';
import { Layout } from './layout';
import englishMessages from './i18n/en';
import germanMessages from './i18n/de';
import { lightTheme } from './layout/themes';
import Configuration from './configuration/Configuration';

import users from './users';
import products from './products';
import orders from './orders';
import invoices from './invoices';
import notifications from './notifications';
import { Dashboard } from './dashboard';

import { ReactNotifications, Store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import MyNotification from './components/notification';

const i18nProvider = polyglotI18nProvider(locale => {
    if (locale === 'en') {
        return import('./i18n/en').then(messages => messages.default);
    }
    // Always fallback on english
    return germanMessages;
}, 'de');

const App = () => {
    return (
        <>
            <ReactNotifications />
            <Admin
                title=""
                dashboard={Dashboard}
                dataProvider={dataProvider}
                authProvider={authProvider}
                loginPage={false}
                layout={Layout}
                i18nProvider={i18nProvider}
                disableTelemetry
                theme={lightTheme}
                notification={MyNotification}
            >
                <CustomRoutes>
                    <Route path="/configuration" element={<Configuration />} />
                </CustomRoutes>
                <Resource name='users' {...users} />
                <Resource name='products' {...products} />
                <Resource name='orders' {...orders} />
                <Resource name='invoices' {...invoices} />
                <Resource name='notifications' {...notifications} />
            </Admin>
        </>
    );
};

export default App;
