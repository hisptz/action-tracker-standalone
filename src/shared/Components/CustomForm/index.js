import React from 'react';
import PropTypes from 'prop-types';
import { CustomFormField } from '../../../core/models/customFormField';
import { Field, Form } from 'react-final-form';
import { useForm, Controller } from "react-hook-form";
import { map } from 'lodash';
import FormField from './Components/FormField';
import { Button} from '@dhis2/ui';

function CustomForm({ formFields }) {

  const { control, errors, handleSubmit } = useForm({mode: 'onBlur', reValidateMode: 'onBlur'});

  const onSubmit = (data) => {
    // console.log(data)
  };
  
  return (

            <form onSubmit={handleSubmit(onSubmit)}>
              {map(formFields || [], (field) => (
                <FormField field={field} errors={errors} key={field.id} control={control} />
              ))}
              
            </form>
  );
}

CustomForm.propTypes = {
  formFields: PropTypes.arrayOf(PropTypes.instanceOf(CustomFormField)),
};

export default CustomForm;
