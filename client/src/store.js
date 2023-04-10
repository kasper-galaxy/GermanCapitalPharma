import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import {
    userRegisterReducer,
    userGetProfileReducer,
    userLoginReducer,
    userSetPasswordReducer,
    userLicenseReducer,
    userForgotPasswordReducer,
    userUpdateProfileReducer,
    userCheckEmailDuplicateReducer,
    userUploadLicenseReducer
} from './reducers/user.reducer';
import {
    productDetailsReducer,
    productListReducer,
    productShopReducer
} from './reducers/product.reducer';
import { filterReducer } from './reducers/filter.reducer';
import { snackbarReducer } from './reducers/snackbar.reducer.';
import { cartOpenDrawerReducer, cartReducer } from './reducers/cart.reducer';
import { orderListReducer, orderPlaceReducer } from './reducers/order.reducer';

const reducers = combineReducers({
    userRegister: userRegisterReducer,
    userGetProfile: userGetProfileReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userLogin: userLoginReducer,
    userCheckEmail: userCheckEmailDuplicateReducer,
    userSetPassword: userSetPasswordReducer,
    userForgotPassword: userForgotPasswordReducer,
    userLicense: userLicenseReducer,
    userUploadLicense: userUploadLicenseReducer,
    snackbarState: snackbarReducer,
    
    productShop: productShopReducer,
    productList: productListReducer,
    productDetails: productDetailsReducer,

    cart: cartReducer,
    cartOpenDrawer: cartOpenDrawerReducer,

    filter: filterReducer,

    orderPlace: orderPlaceReducer,
    orderList: orderListReducer,
});

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const userInfoFromStorage = localStorage.getItem('profile')
    ? JSON.parse(localStorage.getItem('profile'))
    : null;

const initialState = {
    cart: {
      cartItems: cartItemsFromStorage,
    },
    userLogin: {
        userInfo: userInfoFromStorage,
    },
    userRegister: {
        userInfo: {}  
    },
    userGetProfile: {
        userInfo: {}  
    },
    userUpdateProfile: {
    },
    userSetPassword: {
    },
    userCheckEmail: {
    },
    userForgotPassword: {
    },
    userUploadLicense: {
    },
    userLicense: {
        documents: {}
    },
}

const middlewares = [thunk];

const store = createStore(
    reducers,
    initialState,
    composeWithDevTools(applyMiddleware(...middlewares))
);

export default store;