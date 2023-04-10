import React from 'react';
import { Container, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import { 
    COLOR_FONT_GRAY,
    COLOR_WHITE
 } from '../constants/color.constants.js';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        bottom: 0,
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        backgroundColor: COLOR_WHITE,
        width: '100%',
        maxWidth: '100%',
        paddingTop: 16,
        paddingBottom: 16,
        height: 56,
        zIndex: 999
    },
    box: {
        ...theme.mixins.customize.flexMixin('center', 'center'),
        color: COLOR_FONT_GRAY,
        '@media (max-width: 960px)': {
            textAlign: 'center',
            flexDirection: 'column',
            '& $copyright': {
                padding: '10px 0 0',
            }
        }
    },
    copyright: {
        flexGrow: 1,
        paddingLeft: 100
    },
    btnGroup: {
        ...theme.mixins.customize.flexMixin('center', 'center'),
    }
}));

const Footer = () => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <footer>
            <Container className={classes.root}>
                <div className={classes.box}>
                    <Typography
                        variant='body2'
                        className={classes.copyright}
                        component='p'>
                        {t('Copyright')} &copy; 2022 {t('PharmacyStore')}. {t('AllRightReserved')}
                    </Typography>
                    <div className={classes.btnGroup}>
                        <Link
                            color='textPrimary'
                            style={{
                                paddingRight: 24,
                                paddingLeft: 24,
                                fontSize: 16
                            }}
                            component={RouterLink}
                            to={`/imprint`}>
                            {t('Imprint')}
                        </Link>
                        <Link
                            color='textPrimary'
                            style={{
                                paddingRight: 24,
                                paddingLeft: 24,
                                fontSize: 16
                            }}
                            component={RouterLink}
                            to={`/data-privacy`}>
                            {t('DataPrivacy')}
                        </Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;