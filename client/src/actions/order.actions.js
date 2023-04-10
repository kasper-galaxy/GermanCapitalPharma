import axios from "axios";
import { ORDER_LIST_FAIL, ORDER_LIST_REQUEST, ORDER_LIST_SUCCESS, ORDER_PLACE_FAIL, ORDER_PLACE_REQUEST, ORDER_PLACE_SUCCESS } from "../constants/order.constant";
import { errorHandler } from "../utils";

axios.defaults.withCredentials = true;
export const placeOrder = ({ cartData }) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_PLACE_REQUEST });

        const {
            userLogin: { userInfo }
          } = getState();
      
        const _config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post(
            '/api/orders/place',
            {
                cartData
            },
            _config
        );

        dispatch({
            type: ORDER_PLACE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        errorHandler(dispatch, error, ORDER_PLACE_FAIL)
    }
}

export const listOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_LIST_REQUEST });

        const {
            userLogin: { userInfo }
          } = getState();
      
        const _config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post(
            '/api/orders/list',
            _config
        );

        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        errorHandler(dispatch, error, ORDER_LIST_FAIL)
    }
}
