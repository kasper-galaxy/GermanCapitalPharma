import { SNACKBAR_CLEAR, SNACKBAR_OPEN } from '../constants/snackbar.constant';

export const openSnackbar = (message, variant, link = { hasLink: false }) => {
  console.log(message, variant);
  return {
    type: SNACKBAR_OPEN,
    payload: { message, variant, link },
  };
};

export const clearSnackbar = () => {
  return {
    type: SNACKBAR_CLEAR,
  };
};
