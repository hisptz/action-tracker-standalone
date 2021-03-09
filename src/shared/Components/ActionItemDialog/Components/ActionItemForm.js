import { InputFieldFF, CheckboxFieldFF, Button } from '@dhis2/ui';
import { Field, Form } from 'react-final-form';

function ActionItemForm({ type }) {

  return (
    <Form onSubmit={(data) => console.log(data)} >
      <Field
        name="actionDescription"
        component={InputFieldFF}
        label="Action Description"
        required
      />
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
       <Button primary>Save</Button>
    </Form>
  );
}

export default ActionItemForm;
