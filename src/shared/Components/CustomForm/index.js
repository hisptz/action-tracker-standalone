import PropTypes from 'prop-types';
import { CustomFormField } from '../../../core/models/customFormField';
import { map } from 'lodash';
import FormField from './Components/FormField';


function CustomForm({ formFields, control}) {


  return (
    <form style={{ overflow: 'hidden' }}>
      {map(formFields || [], (field) => (
        <FormField
          field={field}
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
