import { ORDER_LIST_FAIL, ORDER_LIST_REQUEST, ORDER_LIST_RESET, ORDER_LIST_SUCCESS, ORDER_PLACE_FAIL, ORDER_PLACE_REQUEST, ORDER_PLACE_RESET, ORDER_PLACE_SUCCESS } from "../constants/order.constant";

export const orderPlaceReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_PLACE_REQUEST:
            return { loading: true };
        case ORDER_PLACE_SUCCESS:
            return { loading: false, IsSuccess: true, orderInfo: action.payload };
        case ORDER_PLACE_FAIL:
            return { loading: false, error: action.payload };
        case ORDER_PLACE_RESET:
            return {};
        default:
            return state;
    }
}

export const orderListReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_LIST_REQUEST:
            return { loading: true };
        case ORDER_LIST_SUCCESS:
            return { loading: false, IsSuccess: true, orders: action.payload };
        case ORDER_LIST_FAIL:
            return { loading: false, error: action.payload };
        case ORDER_LIST_RESET:
            return {};
        default:
            return state;
    }
}