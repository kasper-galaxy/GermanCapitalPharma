import axios from 'axios';
import { 
  PRODUCT_DETAILS_FAIL, 
  PRODUCT_DETAILS_REQUEST, 
  PRODUCT_DETAILS_SUCCESS, 
  PRODUCT_LIST_FAIL, 
  PRODUCT_LIST_REQUEST, 
  PRODUCT_LIST_SUCCESS, 
  PRODUCT_SHOP_FAIL, 
  PRODUCT_SHOP_REQUEST, 
  PRODUCT_SHOP_SUCCESS 
} from '../constants/product.constant';

axios.defaults.withCredentials = true;
export const listShopProduct = (type, itemsPerPage, pageNumber, keyword) => async (dispatch, getState) => {
    dispatch({ type: PRODUCT_SHOP_REQUEST });
    let payload = {};
    let error = null;

    if (keyword) {
      await dispatch(listProducts(keyword, itemsPerPage, pageNumber));
      payload = getState().productList;
      error = getState().productList.error;
    } else {
      switch (type) {
        case 'default':
          await dispatch(listProducts('', itemsPerPage, pageNumber));
          payload = getState().productList;
          error = getState().productList.error;
          break;
        // case 'latest':
        //   await dispatch(listLatestProducts(pageNumber));
        //   payload = getState().productLatest;
        //   error = getState().productLatest.error;
        //   break;
        // case 'rating':
        //   await dispatch(listTopProducts(pageNumber));
        //   payload = getState().productTopRated;
        //   error = getState().productTopRated.error;
        //   break;
        // case 'sale':
        //   await dispatch(listSaleProducts(pageNumber));
        //   payload = getState().productSale;
        //   error = getState().productSale.error;
        //   break;
        // case 'priceAsc':
        //   await dispatch(listSortByPriceProducts('asc', pageNumber));
        //   payload = getState().productSortByPrice;
        //   error = getState().productSortByPrice.error;
        //   break;
        // case 'priceDesc':
        //   await dispatch(listSortByPriceProducts('desc', pageNumber));
        //   payload = getState().productSortByPrice;
        //   error = getState().productSortByPrice.error;
        //   break;
        default:
          break;
      }
    }

    dispatch({
      type: PRODUCT_SHOP_SUCCESS,
      payload,
    });

    if (error) {
      dispatch({
        type: PRODUCT_SHOP_FAIL,
        payload: error,
      });
    }
  };

export const listProducts = (keyword = '', itemsPerPage = 8, pageNumber = '', option = '') =>
  async (dispatch) => {
    try {
      dispatch({ type: PRODUCT_LIST_REQUEST });

      const { data } = await axios.get(
        `/api/products/shop?keyword=${keyword}&itemsPerPage=${itemsPerPage}&pageNumber=${pageNumber}&option=${option}`
      );

      dispatch({
        type: PRODUCT_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const fetchProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};