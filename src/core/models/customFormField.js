export class CustomFormField {
  constructor({id, name, formName, valueType, mandatory, compulsory, validations, optionSet,min,max}) {
    this.id = id;
    this.name = name;
    this.formName = formName;
    this.valueType = valueType;
    this.validations = validations;
    this.mandatory = mandatory;
    this.compulsory = compulsory;
    this.optionSet = optionSet;
    this.min = min;
    this.max = max;
  }

}

