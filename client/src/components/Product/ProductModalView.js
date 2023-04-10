import { Button, IconButton, makeStyles, Modal, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import ClearIcon from '@material-ui/icons/Clear';
import { COLOR_BUTTON_PRIMARY_BACKGROUND, COLOR_WHITE } from '../../constants/color.constants';

const useStyles = makeStyles((theme) => ({
    wrapper: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '70%',
      height: '75%',
      display: 'flex',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
      [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        overflowY: 'scroll',
        '& $imageWrapper, $content': {
          flexBasis: '100%',
          maxWidth: '100%',
        },
        '& $imageWrapper $image': {
          height: '100%',
          objectFit: 'cover',
        },
        '& $content': {
          overflowY: 'unset',
        },
      },
    },
    imageWrapper: {
      flexBasis: '50%',
      maxWidth: '50%',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: 'auto',
    },
    content: {
      flexBasis: '50%',
      maxWidth: '50%',
      margin: '30px 0 30px 30px',
      paddingRight: 30,
      overflowY: 'auto',
    },
    closeButton: {
      position: 'absolute',
      top: 5,
      right: 5,
      zIndex: 10,
    },
    description: {
      whiteSpace: 'pre-wrap',
      fontSize: 15,
      color: theme.palette.grey[700],
      marginBottom: 32
    },
  }));
  
  const ProductModalView = (props) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <Modal open={props.openModal} onClose={() => props.setOpenModal(false)}>
            <div className={classes.wrapper}>
                <IconButton
                    style={{
                        color: COLOR_BUTTON_PRIMARY_BACKGROUND
                    }}
                    onClick={() => props.setOpenModal(false)}
                    className={classes.closeButton}>
                    <ClearIcon />
                </IconButton>
                <div className={classes.imageWrapper}>
                    <img 
                        className={classes.image}
                        src={props.images && props.images[0].url}
                        alt={props.name} />
                </div>
                <div className={classes.content}>
                    <Typography
                        variant='h3'
                        component='h2'
                        gutterBottom
                        style={{ fontSize: 26, fontWeight: 500 }}
                    >
                        {props.name}
                    </Typography>
                    <Typography
                        variant='body1'
                        component='p'
                        className={classes.description}>
                        <div dangerouslySetInnerHTML={{ __html: props.description }}></div>
                    </Typography>
                    <Button
                        variant='contained'
                        style={{
                        color: COLOR_WHITE,
                        backgroundColor:COLOR_BUTTON_PRIMARY_BACKGROUND
                        }}
                        component={RouterLink}
                        to={`/product/${props.id}`}>
                        {t('ViewDetails')}

                    </Button>
                </div>
            </div>
        </Modal>
    );
};

  export default ProductModalView;