import {DataElement, TrackedEntityAttribute} from "@hisptz/dhis2-utils";
import {RHFDHIS2FormFieldProps} from "@hisptz/dhis2-ui";
import i18n from "@dhis2/d2-i18n";

export function getFieldProps(mandatory: boolean, attribute: TrackedEntityAttribute | DataElement): RHFDHIS2FormFieldProps {
    return {
        label: attribute.formName ?? attribute.shortName,
        name: attribute.id,
        valueType: attribute.valueType as any,
        required: mandatory,
        optionSet: attribute.optionSet,
        validations: {
            required: {
                value: mandatory,
                message: i18n.t("This field is required")
            }
        }
    }
}
