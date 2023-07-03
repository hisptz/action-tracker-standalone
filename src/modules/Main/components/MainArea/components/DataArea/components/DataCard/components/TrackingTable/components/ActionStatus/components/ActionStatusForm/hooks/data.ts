import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import {useCallback} from "react";
import {get} from "lodash";
import {uid} from "@hisptz/dhis2-utils";
import {useConfiguration} from "../../../../../../../../../../../../../../../shared/hooks/config";

const actionStatusMutation: any = {
    resource: "tracker",
    type: "create",
    data: ({data}: { data: any }) => data,
    params: {
        importStrategy: 'CREATE_AND_UPDATE',
        importMode: 'COMMIT',
        async: false,
        validationMode: 'FAIL_FAST'
    }
}

export function generateEvent(data: Record<string, any>, {orgUnit, program, programStage, enrollment, trackedEntity}: {
    orgUnit: string;
    program: string;
    programStage: string;
    enrollment: string;
    trackedEntity: string;
}) {

    const occurredAt = get(data, ['occurredAt']);

    delete data['occurredAt']

    return {
        event: uid(),
        program,
        programStage,
        orgUnit,
        trackedEntity,
        enrollment,
        status: "ACTIVE",
        dataValues: Object.entries(data).map(([key, value]) => {
            return {
                dataElement: key,
                value
            }
        }),
        occurredAt
    }
}


export function useManageActionStatus({instance, onComplete}: {
    instance: any, onComplete: () => void
}) {
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}))
    const [uploadPayload, {loading,}] = useDataMutation(actionStatusMutation, {
        onComplete: () => {
            show({
                message: i18n.t("Successfully created status", {}), type: {success: true}
            });
            onComplete();
        },
        onError: () => {
            show({
                message: i18n.t("Failed to create status", {}), type: {critical: true}
            })
        }
    });
    const {config} = useConfiguration();

    const actionStatusProgramStage = config?.action?.statusConfig?.id as string;

    const onSave = useCallback(async (data: Record<string, any>) => {
        const event = generateEvent(data, {
            orgUnit: instance.orgUnit,
            program: instance.program,
            programStage: actionStatusProgramStage,
            enrollment: instance.enrollment,
            trackedEntity: instance.trackedEntity
        });
        await uploadPayload({
            data: {
                events: [
                    event
                ]
            }
        })
    }, [])


    return {
        onSave,
        saving: loading
    }
}
