
import axios from 'axios';
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_CLEAR_ITEMS, CART_OPEN_DRAWER_PREVIEW, CART_UPDATE_ITEM } from '../constants/cart.constant';

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      name: data.name,
      qty: qty,
      images: data.images,
      price: data.price,
      vat: data.vat,
      product: data.id,
    },
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const updateCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: CART_UPDATE_ITEM,
    payload: {
      name: data.name,
      qty: qty,
      images: data.images,
      price: data.price,
      vat: data.vat,
      product: data.id,
    },
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const setOpenCartDrawer = (isOpen) => {
  return { type: CART_OPEN_DRAWER_PREVIEW, payload: isOpen };
};