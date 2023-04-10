import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_CLEAR_ITEMS, CART_OPEN_DRAWER_PREVIEW, CART_UPDATE_ITEM } from '../constants/cart.constant';

export const cartReducer = (state = { cartItems: [] }, action) => {
    switch (action.type) {
        case CART_ADD_ITEM:
            // console.log('cart add item');
            const item = action.payload;
            // console.log('payload item', item);

            // console.log('cartItems', state.cartItems);
            const existItem = state.cartItems.find((x) => x.product === item.product);

            // console.log("existItem", existItem);

            if (existItem) {
                existItem.qty = parseInt(existItem.qty) + parseInt(item.qty);
                // console.log("after existItem", existItem);
                return {
                    ...state,
                    cartItems: state.cartItems.map((x) =>
                        x.product === existItem.product ? existItem : x
                ),};
            }
            return {
                    ...state,
                    cartItems: [...state.cartItems, item],
                };
        case CART_UPDATE_ITEM:
            // console.log('cart add item');
            const updateItem = action.payload;
            // console.log('payload item', item);

            // console.log('cartItems', state.cartItems);
            const updateExistItem = state.cartItems.find((x) => x.product === updateItem.product);

            // console.log("existItem", existItem);

            if (updateExistItem) {
                updateExistItem.qty = parseInt(updateItem.qty);
                // console.log("after existItem", existItem);
                return {
                    ...state,
                    cartItems: state.cartItems.map((x) =>
                        x.product === updateExistItem.product ? updateExistItem : x
                ),};
            }
            return {
                    ...state,
                    cartItems: [...state.cartItems, updateItem],
                };
        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    (item) => item.product !== action.payload
                ),
            };
        case CART_CLEAR_ITEMS:
            return { cartItems: [] };
        default:
            return state;
}
};
  
export const cartOpenDrawerReducer = (state = false, action) => {
    if (action.type === CART_OPEN_DRAWER_PREVIEW) {
        return action.payload;
    }
    return state;
};
  