import {useMetadata} from "../../../hooks/metadata";
import {useMemo} from "react";
import {RHFDHIS2FormFieldProps} from "@hisptz/dhis2-ui";
import {DataElement, TrackedEntityAttribute} from "@hisptz/dhis2-utils";
import i18n from '@dhis2/d2-i18n';

function getFieldProps(mandatory: boolean, attribute: TrackedEntityAttribute | DataElement): RHFDHIS2FormFieldProps {
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

export function useFormMeta({id, type}: { id: string; type: 'program' | 'programStage' }) {
    const {loading, programs} = useMetadata();
    const programStages = useMemo(() => programs?.map(program => program.programStages).flat(), [programs]);

    const instanceMeta = useMemo(() => {
        if (type === "program") {
            return programs?.find(program => program.id === id);
        } else {
            return programStages?.find(programStage => programStage?.id === id);
        }
    }, [programs, programStages, id, type])

    const fields: RHFDHIS2FormFieldProps[] = useMemo(() => {
        if (loading) return [] as RHFDHIS2FormFieldProps[];
        if (type === "program") {
            const program = programs?.find(program => program.id === id);
            return program?.programTrackedEntityAttributes?.map(({mandatory, trackedEntityAttribute}) => {
                return getFieldProps(mandatory, trackedEntityAttribute)
            }) ?? []
        } else {
            const programStage = programStages?.find(programStage => programStage?.id === id);
            return programStage?.programStageDataElements?.map(({compulsory, dataElement}) => {
                return getFieldProps(compulsory ?? false, dataElement)
            }) ?? []
        }
    }, [programStages, programs]);

    return {
        fields,
        loading,
        instanceMeta
    }

}
