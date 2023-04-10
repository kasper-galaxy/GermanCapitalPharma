import axios from 'axios';
import {
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_SET_PASSWORD_REQUEST,
    USER_SET_PASSWORD_SUCCESS,
    USER_SET_PASSWORD_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_GET_PROFILE_REQUEST,
    USER_GET_PROFILE_SUCCESS,
    USER_GET_PROFILE_FAIL,
    USER_FORGOT_PASSWORD_REQUEST,
    USER_FORGOT_PASSWORD_SUCCESS,
    USER_FORGOT_PASSWORD_FAIL,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_CHECK_EMAIL_DUPLICATE_REQUEST,
    USER_CHECK_EMAIL_DUPLICATE_SUCCESS,
    USER_CHECK_EMAIL_DUPLICATE_FAIL,
    USER_UPLOAD_LICENSE_REQUEST,
    USER_UPLOAD_LICENSE_SUCCESS,
    USER_UPLOAD_LICENSE_FAIL
} from '../constants/user.constant';
import { errorHandler } from '../utils';

axios.defaults.withCredentials = true;

export const register = ({ formData }) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });

        const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
        };
        const { data } = await axios.post(
            '/api/users/signup',
            formData,
            config
        );
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        });
        
        localStorage.removeItem('reg_profile');
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
                error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
}

export const setPassword = ({ password, token }) => async (dispatch) => {
    try {
      dispatch({ type: USER_SET_PASSWORD_REQUEST });
  
      const _config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
  
      const { data } = await axios.post(
        '/api/users/set-password',
        {
          password, token
        },
        _config
      );
  
      dispatch({
        type: USER_SET_PASSWORD_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: USER_SET_PASSWORD_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
};

export const forgotPassword = ({ email }) => async (dispatch) => {
  try {
    dispatch({ type: USER_FORGOT_PASSWORD_REQUEST });

    const _config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/users/forgot-password',
      {
        email
      },
      _config
    );

    dispatch({
      type: USER_FORGOT_PASSWORD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_FORGOT_PASSWORD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const login = ({ email, password, captchaValue }) => async (dispatch) => {
    dispatch({ type: USER_LOGIN_REQUEST });

    const _config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    axios.post(
      '/api/users/login',
      {
        email, password, captchaValue
      },
      _config
    )
    .then(({ data }) => {
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data,
      });
      
      // if (data.isAdmin) {
      //   localStorage.setItem('admin-token', data.token);
      //   window.location.href = '/admin';
      // } else {
        localStorage.setItem('profile', JSON.stringify(data));
    })
    .catch(error => {
      if (error.response && error.response.status === 0) {
        window.location.href = '/admin';
      } else {
        dispatch({
          type: USER_LOGIN_FAIL,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        });
      }
    });
};

export const checkEmailDuplicate = ({ email }) => async (dispatch) => {
  try {
    dispatch({ type: USER_CHECK_EMAIL_DUPLICATE_REQUEST });

    const _config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/users/check-email',
      {
        email
      },
      _config
    );

    dispatch({
      type: USER_CHECK_EMAIL_DUPLICATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_CHECK_EMAIL_DUPLICATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getProfile = ({ email }) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_GET_PROFILE_REQUEST });

    const {
      userLogin: { userInfo }
    } = getState();

    const _config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      '/api/users/get-profile',
      {
        email
      },
      _config
    );

    dispatch({
      type: USER_GET_PROFILE_SUCCESS,
      payload: data,
    });

  } catch (error) {
    // dispatch({
    //   type: USER_GET_PROFILE_FAIL,
    //   payload:
    //     error.response && error.response.data.message
    //       ? error.response.data.message
    //       : error.message,
    // });
    errorHandler(dispatch, error, USER_GET_PROFILE_FAIL);
  }
};

export const updateProfile = (profileData) => async (dispatch, getState) => {
  try {
      dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

      const {
        userLogin: { userInfo }
      } = getState();

      const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
      };

      const { data } = await axios.post(
          '/api/users/profile',
          profileData,
          config
      );

      dispatch({
          type: USER_UPDATE_PROFILE_SUCCESS,
          payload: data
      });

  } catch (error) {
      // dispatch({
      //     type: USER_UPDATE_PROFILE_FAIL,
      //     payload:
      //         error.response && error.response.data.message
      //         ? error.response.data.message
      //         : error.message,
      // });
      errorHandler(dispatch, error, USER_UPDATE_PROFILE_FAIL);
  }
}

export const uploadLicense = ({ formData }) => async (dispatch) => {
  try {
      dispatch({ type: USER_UPLOAD_LICENSE_REQUEST });

      const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
      };
      const { data } = await axios.post(
          '/api/users/upload-license',
          formData,
          config
      );
      dispatch({
          type: USER_UPLOAD_LICENSE_SUCCESS,
          payload: data
      });
      
  } catch (error) {
      dispatch({
          type: USER_UPLOAD_LICENSE_FAIL,
          payload:
              error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
      });
  }
}

export const logout = () => (dispatch) => {
  localStorage.clear();
  window.location.href = '/';
  
  dispatch({ type: USER_LOGOUT });
};