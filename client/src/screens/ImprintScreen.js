import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Meta from '../components/Meta';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
  },
  form: {
    '& > *': {
      marginBottom: 16,
    },
  },
  content: {
    padding: 24,
    boxShadow: '0 10px 31px 0 rgba(0,0,0,0.05)',
  },
  boxContainer: {
    position: 'relative',
    ...theme.mixins.customize.flexMixin('center', 'center', 'column'),
    height: '100%',
  },
}));

const ImprintScreen = ({ history }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  
  return (
    <Container maxWidth='xl' style={{ marginBottom: 48 }}>
      <Meta title={t('Imprint') + ' | ' + t('PharmacyStore')} />
      <Grid container className={classes.breadcrumbsContainer}>
        {/* <Grid item xs={12}>
        </Grid> */}
      </Grid>
      <Box>
        <Paper elevation={0} className={classes.content} square >
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Typography variant='h3' gutterBottom>
                {t('Imprint')}
              </Typography> <br />
              <Typography variant='h6' gutterBottom>
                {t('ImprintCaptial')}
              </Typography>
              <Typography variant='h6' gutterBottom>
                {t('ImprintAddress')}
              </Typography> <br />
              <Typography variant='h6' gutterBottom>
                {t('ImprintPostCode')}
              </Typography>
              <Typography variant='h6' gutterBottom>
                {t('ImprintVatIDNo')}
              </Typography>
              <Typography variant='h6' gutterBottom>
                {t('ImprintCommercialRegister')}
              </Typography> <br/>
              <Typography variant='h6' gutterBottom>
                {t('ImprintManagingDirector')}
              </Typography>
              <br />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default ImprintScreen;
