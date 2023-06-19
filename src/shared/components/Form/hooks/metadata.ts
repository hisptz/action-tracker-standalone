import {useMetadata} from "../../../hooks/metadata";
import {useMemo} from "react";
import {DHIS2FormFieldProps} from "@hisptz/dhis2-ui";
import {DataElement, TrackedEntityAttribute} from "@hisptz/dhis2-utils";


function getFieldProps(mandatory: boolean, attribute: TrackedEntityAttribute | DataElement): DHIS2FormFieldProps {
    return {
        label: attribute.displayName,
        name: attribute.id,
        type: attribute.valueType,
        required: mandatory,
        options: attribute.optionSet?.options
    } as unknown as DHIS2FormFieldProps
}

export function useFormFields({id, type}: { id: string; type: 'program' | 'programStage' }) {
    const {loading, programs} = useMetadata();
    const programStages = useMemo(() => programs?.map(program => program.programStages).flat(), [programs]);

    const fields: DHIS2FormFieldProps[] = useMemo(() => {
        if (loading) return [] as DHIS2FormFieldProps[];
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
        loading
    }

}
