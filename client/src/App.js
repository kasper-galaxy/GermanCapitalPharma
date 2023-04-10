import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import SignupLicenseScreen from './screens/SignupLicenseScreen';
import SignupProfileScreen from './screens/SignupProfileScreen';
import SignupSubmitScreen from './screens/SignupSutmitScreen';
import CheckEmailScreen from './screens/CheckEmailScreen';
import SetPasswordScreen from './screens/SetPasswordScreen';
import ShopScreen from './screens/ShopScreen';
import ProfileScreen from './screens/ProfileScreen';
import SnackbarMessage from './components/SnackbarMessage';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import CartPreview from './components/Drawer/CartPreview';
import CheckoutScreen from './screens/CheckoutScreen';
import ImprintScreen from './screens/ImprintScreen';
import DataPrivacyScreen from './screens/DataPrivacyScreen';
import OrderListScreen from './screens/OrderListScreen';
import ThxOrderScreen from './screens/ThxOrderScreen';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path='/login' component={LoginScreen} exact />
                <Route path='/forgot-password' component={ForgotPasswordScreen} exact />
                <Route path='/check-email' component={CheckEmailScreen} exact />
                <Route path='/set-password' component={SetPasswordScreen} exact />
                <Route path='/set-password/:token' component={SetPasswordScreen} exact />
                <Route path='/checkout/:id' component={ThxOrderScreen} />
                <Route>
                    <Header />
                    <main className='main'>
                        <Route path='/' component={HomeScreen} exact />
                        <Route path='/profile' component={ProfileScreen} exact />
                        <Route path='/signup/profile' component={SignupProfileScreen} exact />
                        <Route path='/signup/license' component={SignupLicenseScreen} exact />
                        <Route path='/signup/submit' component={SignupSubmitScreen} exact />
                        <Route path='/search' component={HomeScreen} exact />
                        <Route path='/shop' component={ShopScreen} exact />
                        <Route path='/product/:id' component={ProductScreen} exact />
                        <Route path='/cart' component={CartScreen} />
                        <Route path='/checkout' component={CheckoutScreen} exact />
                        <Route path='/imprint' component={ImprintScreen} />
                        <Route path='/data-privacy' component={DataPrivacyScreen} />
                        <Route path='/order-list' component={OrderListScreen} />
                    </main>
                    <Footer />
                    <CartPreview />
                </Route>
            </Switch>
            <SnackbarMessage />
        </Router>
    );
};

export default App;