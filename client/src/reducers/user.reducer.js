import {
    USER_FORGOT_PASSWORD_FAIL,
    USER_FORGOT_PASSWORD_REQUEST,
    USER_FORGOT_PASSWORD_RESET,
    USER_FORGOT_PASSWORD_SUCCESS,
    USER_GET_PROFILE_FAIL,
    USER_GET_PROFILE_REQUEST,
    USER_GET_PROFILE_RESET,
    USER_GET_PROFILE_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_RESET,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_RESET,
    USER_REGISTER_SUCCESS,
    USER_SET_LICENSE, 
    USER_SET_PASSWORD_FAIL, 
    USER_SET_PASSWORD_REQUEST, 
    USER_SET_PASSWORD_RESET,
    USER_SET_PASSWORD_SUCCESS, 
    USER_UPDATE_PROFILE_FAIL, 
    USER_UPDATE_PROFILE_RESET, 
    USER_UPDATE_PROFILE_SUCCESS,
    USER_CHECK_EMAIL_DUPLICATE_REQUEST,
    USER_CHECK_EMAIL_DUPLICATE_SUCCESS,
    USER_CHECK_EMAIL_DUPLICATE_FAIL,
    USER_CHECK_EMAIL_DUPLICATE_RESET,
    USER_UPLOAD_LICENSE_REQUEST,
    USER_UPLOAD_LICENSE_SUCCESS,
    USER_UPLOAD_LICENSE_FAIL,
    USER_UPLOAD_LICENSE_RESET,
    USER_UPDATE_PROFILE_REQUEST,
} from '../constants/user.constant';


export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true };
        case USER_REGISTER_SUCCESS:
            return { loading: false, IsSuccess: true, userInfo: action.payload };
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload };
        case USER_REGISTER_RESET:
            return {};
        default:
            return state;
    }
}

export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true };
        case USER_LOGIN_SUCCESS:
            return { loading: false, IsSuccess: true, userInfo: action.payload };
        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload };
        case USER_LOGIN_RESET:
            return {};
        case USER_LOGOUT:
            return {};
        default:
            return state;
    }
}

export const userSetPasswordReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_SET_PASSWORD_REQUEST:
            return { loading: true };
        case USER_SET_PASSWORD_SUCCESS:
            return { loading: false, IsSuccess: true };
        case USER_SET_PASSWORD_FAIL:
            return { loading: false, error: action.payload };
        case USER_SET_PASSWORD_RESET:
            return {};
        default:
            return state;
    }
}

export const userForgotPasswordReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_FORGOT_PASSWORD_REQUEST:
            return { loading: true };
        case USER_FORGOT_PASSWORD_SUCCESS:
            return { loading: false, IsSuccess: true };
        case USER_FORGOT_PASSWORD_FAIL:
            return { loading: false, error: action.payload };
        case USER_FORGOT_PASSWORD_RESET:
            return {};
        default:
            return state;
    }
}

export const userGetProfileReducer = (state = {}, action) => {
    switch(action.type) {
        case USER_GET_PROFILE_REQUEST:
            return { loading: true };
        case USER_GET_PROFILE_SUCCESS:
            return { loading: false, userInfo: action.payload };
        case USER_GET_PROFILE_FAIL:
            return { loading: false, error: action.payload };
        case USER_GET_PROFILE_RESET:
            return {};
        default:
            return state;
    }
};

export const userUpdateProfileReducer = (state = {}, action) => {
    switch(action.type) {
        case USER_UPDATE_PROFILE_REQUEST:
            return { loading: true };
        case USER_UPDATE_PROFILE_SUCCESS:
            return { loading: false, IsSuccess: true };
        case USER_UPDATE_PROFILE_FAIL:
            return { loading: false, error: action.payload };
        case USER_UPDATE_PROFILE_RESET:
            return {};
        default:
            return state;
    }
};

export const userLicenseReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_SET_LICENSE:
        return {...state, documents: action.payload };
      default:
        return state;
    }
};

export const userCheckEmailDuplicateReducer = (state = {}, action) => {
    switch(action.type) {
        case USER_CHECK_EMAIL_DUPLICATE_REQUEST:
            return { loading: true };
        case USER_CHECK_EMAIL_DUPLICATE_SUCCESS:
            return { loading: false, IsSuccess: true };
        case USER_CHECK_EMAIL_DUPLICATE_FAIL:
            return { loading: false, error: action.payload };
        case USER_CHECK_EMAIL_DUPLICATE_RESET:
            return {};
        default:
            return state;
    }
};

export const userUploadLicenseReducer = (state = {}, action) => {
    switch(action.type) {
        case USER_UPLOAD_LICENSE_REQUEST:
            return { upload_loading: true };
        case USER_UPLOAD_LICENSE_SUCCESS:
            return { upload_loading: false, IsSuccess: true };
        case USER_UPLOAD_LICENSE_FAIL:
            return { upload_loading: false, upload_error: action.payload };
        case USER_UPLOAD_LICENSE_RESET:
            return {};
        default:
            return state;
    }
};
