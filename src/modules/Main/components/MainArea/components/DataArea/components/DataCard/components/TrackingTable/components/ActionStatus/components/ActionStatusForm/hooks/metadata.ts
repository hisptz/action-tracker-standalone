import {useConfiguration} from "../../../../../../../../../../../../../../../shared/hooks/config";
import {useMetadata} from "../../../../../../../../../../../../../../../shared/hooks/metadata";
import {find} from "lodash";
import {getFieldProps} from "../../../../../../../../../../../../../../../shared/utils/form";
import {ActionTrackingColumnStateConfig} from "../../../../../../../state/columns";
import {useMemo} from "react";
import i18n from "@dhis2/d2-i18n";
import {RHFDHIS2FormFieldProps} from "@hisptz/dhis2-ui";

export function useFormMeta({columnConfig}: { columnConfig: ActionTrackingColumnStateConfig }) {
    const {config} = useConfiguration();
    const actionStatusConfig = config?.action.statusConfig;
    const {programs} = useMetadata()
    const actionStatusProgramStageConfig = find(find(programs, ['id', config?.action.id])?.programStages, ['id', actionStatusConfig?.id]);

    const fields = useMemo(() => {
        const fields = actionStatusProgramStageConfig?.programStageDataElements?.map(({compulsory, dataElement}) => {
            return getFieldProps(compulsory ?? false, dataElement);
        }) ?? []

        const period = columnConfig.period;
        const eventDateField = {
            name: "occurredAt",
            valueType: "DATE",
            required: true,
            validations: {
                required: {
                    value: true,
                    message: i18n.t("This field is required")
                }
            },
            label: i18n.t("Review Date"), //TODO: Make configurable through the action status config,
            min: period.start.toFormat('yyyy-MM-dd'),
            max: period.end.toFormat('yyyy-MM-dd'),
        } as RHFDHIS2FormFieldProps

        return [
            eventDateField,
            ...fields
        ]

    }, [actionStatusProgramStageConfig])

    return {
        fields
    }
}
