// export const requestResources = {
//    ORG_UNIT: 'organisationUnits'
// }
// export const organisationUnitLevels = {
//    LEVEL_ONE: 1,
//    LEVEL_TWO: 2,
//    LEVEL_THREE: 3
// }
export const FilterComponentTypes = {
    ORG_UNIT: 'ORG_UNIT',
    PERIOD: 'PERIOD',
};
export const Dhis2ValueTypes = {
    INTEGER: {
        name: 'INTEGER',
        formName: 'number',
    },
    TRUE_ONLY: {name: 'TRUE_ONLY', formName: 'checkbox'},
    TEXT: {name: 'TEXT', formName: 'text'},
    NUMBER: {name: 'NUMBER', formName: 'number'},
    DATE: {name: 'DATE', formName: 'date'},
    LONG_TEXT: {name: 'LONG_TEXT', formName: 'textarea'},
    COLOR_PICKER: {name: 'COLOR_PICKER', formName: 'colorpicker'},
    ICON_PICKER: {name: 'ICON_PICKER', formName: 'iconpicker'},
    URL: {name: 'URL', formName: 'url'}
};
