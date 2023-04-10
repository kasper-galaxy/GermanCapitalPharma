import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    '& label': {
      fontSize: 14,
    },
  },
}));

const InputController = ({
  type,
  name,
  label,
  defaultValue,
  required,
  rules,
  InputProps,
  ...props
}) => {
  const classes = useStyles();
  const { control } = useFormContext();
  const { t } = useTranslation();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue || ''}
      render={({ field: { onChange, value, defaultValue, readOnly}, fieldState: { error } }) => (
        <TextField
          type={type}
          label={label}
          value={value}
          readOnly={readOnly}
          onChange={onChange}
          error={!!error}
          helperText={error ? error.message : null}
          InputProps={value ? InputProps : undefined}
          className={classes.root}
          {...props}
        />
      )}
      rules={{ required: required && `(*) ${label} ${t('IsRequired')}`, ...rules }}
    />
  );
};

InputController.defaultProps = {
  type: 'text',
};

export default InputController;
