import {useEffect, useState} from 'react';
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    ButtonStrip,
    Box,
} from '@dhis2/ui';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Metadata from '../../../resources/Json/FormsMetadata.json';
import {getFormattedFormMetadata} from '../../../core/helpers/formsUtilsHelper';
import CustomForm from '../../Components/CustomForm';
import DataFilter from '../../Components/DataFilter';
import {useForm} from 'react-hook-form';
import useIndicators from "../../../core/hooks/indicators";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        overflow: 'hidden',
    },
    button: {
        marginRight: theme.spacing(1),
    },

    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function getSteps() {
    return ['Indicator Details', 'Gap Details'];
}

function getFormattedMetadataFields() {
    const metadataFields = Metadata.gapDetailsForm.fields;
    return getFormattedFormMetadata(metadataFields);
}

function ChallengeDialog({onClose, onUpdate}) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const steps = getSteps();
    const stepsLength = steps.length;
    const {indicators, loading, error} = useIndicators(0);

    const {control, errors, handleSubmit, register, setValue, watch} = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });
    //Register the indicator selector to useForm
    useEffect(() => {
        register('indicatorId')
    });


    const onSubmit = (payload) => {
        console.log(payload);

    };


    const getSelectedIndicator = (indicator) => {
        setValue('indicatorId', indicator)
    };

    const indicatorSelected = watch('indicatorId')

    function getStepContent(step) {
        switch (step) {
            case 0:
                return (
                    <DataFilter
                        options={indicators?.map(({displayName, id}) => ({label: displayName, value: id}))}
                        initiallySelected={indicatorSelected}
                        getSelected={getSelectedIndicator}
                        loading={loading}
                        error={error}
                    />
                );
            case 1:
                const formFields = getFormattedMetadataFields();

                return (
                    <CustomForm
                        formFields={formFields}
                        control={control}
                        errors={errors}
                    />
                );
            default:
                return 'Unknown step';
        }
    }

    const isNextButtonDisabled =
        !((activeStep === 0 && indicatorSelected && indicatorSelected.length) ||
            activeStep === 1);

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        if (indicatorSelected && indicatorSelected.length) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setSkipped(newSkipped);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Modal className="dialog-container" onClose={onClose} large>
            <ModalTitle>Gap Form</ModalTitle>
            <ModalContent>
                <div className={classes.root}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};

                            if (isStepSkipped(index)) {
                                stepProps.completed = false;
                            }
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <div>
                        {activeStep === steps.length ? (
                            <div>
                                <Typography className={classes.instructions}>
                                    All steps completed - you&apos;re finished
                                </Typography>
                                <Button onClick={handleReset} className={classes.button}>
                                    Reset
                                </Button>
                            </div>
                        ) : (
                            <div>
                                {getStepContent(activeStep)}
                            </div>
                        )}
                    </div>
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.button}
                    >
                        Back
                    </Button>

                    <Button
                        primary
                        onClick={
                            activeStep === stepsLength - 1 ? handleSubmit(onSubmit) : handleNext
                        }
                        className={classes.button}
                        disabled={isNextButtonDisabled}
                    >
                        {activeStep === steps.length - 1 ? 'Save Gap' : 'Next'}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}

export default ChallengeDialog;
