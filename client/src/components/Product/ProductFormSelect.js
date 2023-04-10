import React from 'react';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { updateCart } from '../../actions/cart.actions';
import { openSnackbar } from '../../actions/snackbar.action';
import {
  FormControl,
  Button,
  TextField,
} from '@material-ui/core';
import { AiOutlineSync } from 'react-icons/ai';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { COLOR_BUTTON_PRIMARY_BACKGROUND, COLOR_WHITE } from '../../constants/color.constants';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      marginLeft: theme.spacing(1),
    },
  },
}));

const ProductFormSelect = ({ item, className }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { control, handleSubmit } = useForm();

  const updateCartHandler = (data, id) => {
    dispatch(updateCart(id, data.qty));
    dispatch(openSnackbar(t('ItemHasUpdated'), 'success'));
  };

  return (
    <form
      className={clsx(classes.root, className && className)}
      onSubmit={handleSubmit((data) => {
        updateCartHandler(data, item.product);
      })}
      style={{
        justifyContent: "center"
      }}
    >
      <FormControl variant='outlined' size='small'>
        <Controller
          name='qty'
          control={control}
          defaultValue={item.qty}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label={t('Quantity')}
              style={{width: "64px", marginRight: "8px"}}              
            />
          )}
        />
      </FormControl>
      <Button
        type='submit'
        variant='contained'
        style={{
          color: COLOR_WHITE,
          backgroundColor:COLOR_BUTTON_PRIMARY_BACKGROUND
        }}
        size='small'
        startIcon={<AiOutlineSync color={COLOR_WHITE} />}
        disableElevation
      >
        <label style={{fontWeight: "bold"}}>{t('Update')}</label>
      </Button>
    </form>
  );
};

export default ProductFormSelect;
