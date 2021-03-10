import { InputFieldFF, CheckboxFieldFF, Button, InputField } from '@dhis2/ui';
import { Input } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { Field, Form } from 'react-final-form';
import '../styles/ActionItemForm.css';


export function ActionItemForm({ type }) {
  return (
    <Form
      onSubmit={(data) => console.log(data)}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Field name="actionDescription" type="date">
            {({input}) => (
    <div>
      <TextField
        {...input}
      />
    </div>
  )}
  </Field>
          <Field
            name="startDate"
            type="date"
            component={InputFieldFF}
            label="Start Date"
            required
          />
          <Field
            name="endDate"
            type="date"
            component={InputFieldFF}
            label="End Date"
            required
          />
          <Field
            name="responsiblePerson"
            component={InputFieldFF}
            label="Responsible Person"
            required
          />
          <Field
            name="designationTitle"
            component={InputFieldFF}
            label="Designation Title"
            required
          />
          <Field
            type="checkbox"
            name="secureFunds"
            component={CheckboxFieldFF}
            label="Need to secure funds?"
            required
          />
          <Button type="submit">Save</Button>
        </form>
      )}
    >
      {' '}
    </Form>
  );
}

export default ActionItemForm;
