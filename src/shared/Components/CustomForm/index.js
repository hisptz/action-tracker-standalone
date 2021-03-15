import PropTypes from 'prop-types';
import { CustomFormField } from '../../../core/models/customFormField';
import { map } from 'lodash';
import FormField from './Components/FormField';


function CustomForm({ formFields, control, errors}) {


  return (
    <form style={{ overflow: 'hidden' }}>
      {map(formFields || [], (field) => (
        <FormField
          field={field}
          errors={errors}
          key={field.id}
          control={control}
        />
      ))}
    </form>
  );
}

CustomForm.defaultProps = {
  isModalForm: true,
};

CustomForm.propTypes = {
  formFields: PropTypes.arrayOf(PropTypes.instanceOf(CustomFormField)),
  control: PropTypes.any.isRequired,
};

export default CustomForm;
