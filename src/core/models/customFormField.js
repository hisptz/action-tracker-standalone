export class CustomFormField {
  constructor({id, name, formName, valueType, mandatory, compulsory, validations, optionSet}) {
    this.id = id;
    this.name = name;
    this.formName = formName;
    this.valueType = valueType;
    this.validations = validations;
    this.mandatory = mandatory;
    this.compulsory = compulsory;
    this.optionSet = optionSet;
  }

}

