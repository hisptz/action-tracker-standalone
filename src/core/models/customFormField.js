export class CustomFormField {
  constructor({id, name, valueType, mandatory, compulsory, validations}) {
    this.id = id;
    this.name = name;
    this.valueType = valueType;
    this.validations = validations;
    this.mandatory = mandatory;
    this.compulsory = compulsory
  }
}

