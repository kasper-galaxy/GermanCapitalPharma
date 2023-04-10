import React, { useRef, useState } from 'react'
import { ClickAwayListener, Grow, IconButton, makeStyles, MenuItem, MenuList, Paper, Popper } from '@material-ui/core'
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import { LanguageEnglish, LanguageGermany, LanguageGermanyCode, LanguageEnglishCode } from '../../constants/code.constant';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'felx'
    },
    paper: {
        marginRight: theme.spacing(2)
    }
}))

const HeaderLanguage = () => {
    const classes = useStyles();
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const { i18n } = useTranslation();
    

    const handleToogle = (() => {
        setOpen((prevOpen) => !prevOpen)
    });

    const handleClose = (e) => {
        if (anchorRef.current && anchorRef.current.contains(e.target)) {
            return;
        }
        setOpen(false);
    }

    const handleListKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            setOpen(false);
        }
    }

    return (
        <div className={classes.root}>
            <div>
                <IconButton ref={anchorRef} onClick={handleToogle}>
                   <ReactCountryFlag 
                        countryCode={i18n.resolvedLanguage || LanguageGermanyCode}
                        svg
                        style = {{
                            fontSize: '1.05em',
                            lineHeight: '1em',
                            width: '1em',
                            height: '1em',
                        }}
                        title = {i18n.resolvedLanguage === 'de' ? LanguageGermany : LanguageEnglish}
                   /> 
                </IconButton>
                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                            transformOrigin:
                                placement === 'bottom' ? 'center top' : 'center bottom',
                            }}>
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList
                                        autoFocusItem={open}
                                        id='menu-list-grow'
                                        onKeyDown={handleListKeyDown}>
                                        <MenuItem divider>
                                            <button
                                                type='submit'
                                                style={{
                                                  border: "none",
                                                  background: "none"
                                                }}
                                                onClick={() => i18n.changeLanguage('de')}>
                                                    <ReactCountryFlag 
                                                        countryCode={LanguageGermanyCode}
                                                        svg
                                                        style={{
                                                            fontSize: '1.3em',
                                                            lineHeight: '1.3em',
                                                            width: '1.8em',
                                                            height: '1.8em',
                                                            marginTop: '4px',
                                                            marginLeft: '4px',
                                                            marginRight: '8px'
                                                        }}/>
                                                    {LanguageGermany}
                                            </button>
                                        </MenuItem>
                                        <MenuItem>
                                            <button
                                                type='submit'
                                                style={{
                                                    border: "none",
                                                    background: "none"
                                                }}
                                                onClick={() => i18n.changeLanguage('gb')}>
                                                <ReactCountryFlag
                                                    countryCode={LanguageEnglishCode}
                                                    svg
                                                    style={{
                                                        fontSize: '1.3em',
                                                        lineHeight: '1.3em',
                                                        width: '1.8em',
                                                        height: '1.8em',
                                                        marginTop: '4px',
                                                        marginLeft: '4px',
                                                        marginRight: '8px'
                                                    }}
                                                />
                                                {LanguageEnglish}
                                            </button>
                                        </MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </div>
    );
}

export default HeaderLanguage;