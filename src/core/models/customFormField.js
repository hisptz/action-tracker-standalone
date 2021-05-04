export class CustomFormField {
  constructor({id, name, formName, valueType, mandatory, compulsory, validations, optionSet,min,max, dependants, disabled}) {
    this.id = id;
    this.disabled = disabled;
    this.name = name;
    this.formName = formName;
    this.valueType = valueType;
    this.validations = validations;
    this.mandatory = mandatory;
    this.compulsory = compulsory;
    this.optionSet = optionSet;
    this.min = min; //min value for number and date fields
    this.max = max; //max value for number and date fields
    this.dependants = dependants; //Array of field Ids this form field depends on for validation
  }

}

