import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_SHOP_REQUEST,
    PRODUCT_SHOP_SUCCESS,
    PRODUCT_SHOP_FAIL,
    PRODUCT_SHOP_FILTER,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
} from '../constants/product.constant';


export const productListReducer = (state = { products: [] }, action) => {
    switch (action.type) {
      case PRODUCT_LIST_REQUEST:
        return { loading: true, products: [] };
      case PRODUCT_LIST_SUCCESS:
        const { products, page, pages, count } = action.payload;
        return { loading: false, products, page, pages, count };
      case PRODUCT_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };

export const productShopReducer = (
    state = { products: [], tempProducts: [], page: 1, pages: 1 },
    action
  ) => {
    switch (action.type) {
      case PRODUCT_SHOP_REQUEST:
        return { ...state, loading: true };
      case PRODUCT_SHOP_SUCCESS:
        const { page, pages, products, count } = action.payload;
        return {
          loading: false,
          page,
          pages,
          products,
          tempProducts: products,
          count,
        };
      case PRODUCT_SHOP_FAIL:
        return { loading: false, error: action.payload };
      case PRODUCT_SHOP_FILTER:
        return action.payload
          ? {
              ...state,
              products: action.payload,
            }
          : { ...state, products: state.tempProducts };
      default:
        return state;
    }
  };

  
export const productDetailsReducer = (
  state = { product: { reviews: [] } },
  action
) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true, ...state };
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload };
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};