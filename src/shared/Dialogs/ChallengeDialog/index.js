import { useState } from 'react';
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
import { makeStyles } from '@material-ui/core/styles';
import Metadata from '../../../resources/Json/FormsMetadata.json';
import { getFormattedFormMetadata } from '../../../core/helpers/formsUtilsHelper';
import CustomForm from '../../Components/CustomForm';
import DataFilter from '../../Components/DataFilter';
import DataFilterData from '../../../resources/Json/DataFilterData.json';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    overflow: 'hidden'
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

function ChallengeDialog({ onClose, onUpdate }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [indicatorSelected, setIndicatorSelected] = useState([]);
  const [skipped, setSkipped] = useState(new Set());
  const steps = getSteps();

  const getSelectedIndicator = (indicator) => {
    setIndicatorSelected(indicator);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <DataFilter
            options={DataFilterData}
            initiallySelected={indicatorSelected}
            getSelected={getSelectedIndicator}
          />
        );
      case 1:
        const formFields = getFormattedMetadataFields();

        return <CustomForm formFields={formFields} />;
      default:
        return 'Unknown step';
    }
  }

  // const isStepOptional = (step) => {
  //   return step === 1;
  // };

  const canStepGoNext =
    activeStep === 0 && indicatorSelected && indicatorSelected.length
      ? false
      : true;

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

    // setActiveStep((prevActiveStep) => prevActiveStep + 1);
    // setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Modal className="dialog-container"  onClose={onClose} large>
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

                <div style={{ marginTop: '1em' }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                    disabled={canStepGoNext}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

export default ChallengeDialog;
