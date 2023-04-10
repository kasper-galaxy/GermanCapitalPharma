import React from 'react';
import { makeStyles, Step, StepLabel, Stepper } from '@material-ui/core';
import { COLOR_BUTTON_PRIMARY_BACKGROUND } from '../../constants/color.constants';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
    },
    stepper: {
        backgroundColor: theme.palette.background.default,
        padding: 0,
        '& .MuiStepIcon-completed, .MuiStepIcon-active': {
          color: COLOR_BUTTON_PRIMARY_BACKGROUND
        },
    }
}));

const SignupSteps = ({ step }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const steps = [
        t('SignupProfileInformation'), t('SignupUploadDocuments'), t('SignupSubmission')
    ];

    return (
        <div className={classes.root}>
            <Stepper activeStep={step} alternativeLabel className={classes.stepper}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </div>
    );
};

export default SignupSteps;