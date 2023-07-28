import { useMetadata } from "../../../hooks/metadata";
import { useMemo } from "react";
import { RHFDHIS2FormFieldProps } from "@hisptz/dhis2-ui";
import { getFieldProps } from "../../../utils/form";

export function useFormMeta ({
    id,
    type
}: { id: string; type: "program" | "programStage" }) {
    const { programs } = useMetadata();
    const programStages = useMemo(() => programs?.map(program => program.programStages).flat(), [programs]);

    const instanceMeta = useMemo(() => {
        if (type === "program") {
            return programs?.find(program => program.id === id);
        } else {
            return programStages?.find(programStage => programStage?.id === id);
        }
    }, [programs, programStages, id, type]);

    const fields: RHFDHIS2FormFieldProps[] = useMemo(() => {
        if (type === "program") {
            const program = programs?.find(program => program.id === id);
            return program?.programTrackedEntityAttributes?.map(({
                mandatory,
                trackedEntityAttribute,
            }) => {
                return getFieldProps(mandatory, trackedEntityAttribute);
            }) ?? [];
        } else {
            const programStage = programStages?.find(programStage => programStage?.id === id);
            return programStage?.programStageDataElements?.map(({compulsory, dataElement}) => {
                return getFieldProps(compulsory ?? false, dataElement);
            }) ?? [];
        }
    }, [programStages, programs]);

    return {
        fields,
        instanceMeta
    };

}
