import {useEffect, useState} from 'react';
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    ButtonStrip,
} from '@dhis2/ui';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {getFormattedFormMetadata} from '../../../core/helpers/formsUtilsHelper';
import CustomForm from '../../Components/CustomForm';
import DataFilter from '../../Components/DataFilter';
import {useForm} from 'react-hook-form';
import useIndicators from "../../../core/hooks/indicators";
import {useRecoilValue} from "recoil";
import {ConfigState, DimensionsState} from "../../../core/states";
import Gap from "../../../core/models/gap";
import Bottleneck from "../../../core/models/bottleneck";
import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import {confirmModalClose} from "../../../core/helpers/utils";

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

const challengeMutation = {
    type: 'create',
    resource: 'trackedEntityInstances',
    data: ({data}) => data
}

const gapMutation = {
    type: 'create',
    resource: 'events',
    data: ({data}) => data
}

function getSteps() {
    return ['Indicator Details', 'Gap Details'];
}

function getFormattedMetadataFields(metadataFields) {
    return getFormattedFormMetadata(metadataFields);
}

function ChallengeDialog({onClose, onUpdate, challenge}) {
    const {orgUnit} = useRecoilValue(DimensionsState);
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(challenge ? 1 : 0);
    const [skipped, setSkipped] = useState(new Set());
    const steps = getSteps();
    const stepsLength = steps.length;
    const {indicators, loading: indicatorsLoading, error: indicatorsError} = useIndicators(0);
    const {bottleneckProgramMetadata} = useRecoilValue(ConfigState);
    const [mutate, {loading: saving}] = useDataMutation(challenge ? gapMutation : challengeMutation, {
        variables: {data: {}},
        onComplete: () => {
            show({message: 'Challenge saved successfully', type: {success: true}})
            onUpdate();
            onClose();
        },
        onError: error => {
            show({message: error?.message || error.toString()})
        }
    })
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))

    const metadataFields = Gap.getFormFields(bottleneckProgramMetadata);

    const {control, errors, handleSubmit, register, setValue, watch} = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });
    //Register the indicator selector to useForm
    useEffect(() => {
        register('indicator')
    });

    const onSubmit = (payload) => {
        mutate(
            {
                data: generatePayload(payload)
            }
        )
    };

    const generatePayload = (payload) => {
        if (challenge) {
            const newGap = new Gap();
            newGap.setValuesFromForm(payload);
            newGap.indicatorId = challenge.id;
            return newGap.getPayload(orgUnit.id)
        } else {
            const challenge = new Bottleneck();
            challenge.setValuesFromForm({indicator: payload.indicator[0]});
            const newGap = new Gap();
            newGap.setValuesFromForm(payload);
            return challenge.getPayload([newGap.getPayload(orgUnit.id)], orgUnit.id)
        }
    }

    const getSelectedIndicator = (indicator) => {
        setValue('indicator', indicator)
    };

    const indicatorSelected = watch('indicator')
    const formFields = getFormattedMetadataFields(metadataFields);

    function getStepContent(step) {
        switch (step) {
            case 0:
                return (
                    <DataFilter
                        options={indicators?.map(({displayName, id}) => ({label: displayName, value: id}))}
                        initiallySelected={indicatorSelected}
                        getSelected={getSelectedIndicator}
                        loading={indicatorsLoading}
                        error={indicatorsError}
                    />
                );
            case 1:
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
        <Modal className="dialog-container" onClose={_ => confirmModalClose(onClose)} large>
            <ModalTitle>Gap Form</ModalTitle>
            <ModalContent>
                {
                    challenge ? <div>
                            <CustomForm
                                formFields={formFields}
                                control={control}
                                errors={errors}
                            />
                        </div> :
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
                }
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
                        {activeStep === steps.length - 1 ? saving ? 'Saving...' : 'Save Gap' : 'Next'}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}

export default ChallengeDialog;
