import PropTypes from 'prop-types';
import { CustomFormField } from '../../../core/models/customFormField';
import { useForm, Controller } from 'react-hook-form';
import { map } from 'lodash';
import FormField from './Components/FormField';
import { Button, ButtonStrip } from '@dhis2/ui';

function CustomForm({ formFields, isModalForm, onCloseModal }) {
  const { control, errors, handleSubmit } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const onSubmit = async (data) => {
    // await sleep(2000);
    if (data) {
      console.log(data);
      // alert(JSON.stringify(data));
    } else {
      alert('There is an error');
    }
  };

  return (
    <form style={{ overflow: 'hidden' }} onSubmit={handleSubmit(onSubmit)}>
      {map(formFields || [], (field) => (
        <FormField
          field={field}
          errors={errors}
          key={field.id}
          control={control}
        />
      ))}
      <ButtonStrip end>
        {isModalForm && <Button secondary onClick={onCloseModal}>Hide</Button>}
        <Button type="submit" onClick={handleSubmit(onSubmit)} primary>
          Update
        </Button>
      </ButtonStrip>
    </form>
  );
}

CustomForm.defaultProps = {
  isModalForm: true,
};

CustomForm.propTypes = {
  formFields: PropTypes.arrayOf(PropTypes.instanceOf(CustomFormField)),
  isModalForm: PropTypes.bool,
  onCloseModal: PropTypes.func
};

export default CustomForm;
