import {useCallback} from "react";
import {uid} from "@hisptz/dhis2-utils";
import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import {useFormMeta} from "./metadata";
import {useDimensions} from "../../../hooks";
import i18n from '@dhis2/d2-i18n';
import {ParentConfig} from "../../../schemas/config";
import {get, set} from "lodash";


const mutation: any = {
    resource: "tracker",
    type: "create",
    data: ({data}: { data: any }) => data,
    params: ({strategy}: { strategy?: string }) => ({
        importStrategy: strategy ?? 'CREATE_AND_UPDATE',
        importMode: 'COMMIT',
        async: false,
        validationMode: 'FAIL_FAST'
    })
}


function generateTei(data: Record<string, any>, {orgUnit, program, trackedEntityType}: {
    orgUnit: string;
    program: string;
    trackedEntityType: string;
}) {
    const attributes = Object.entries(data).map(([key, value]) => {
        return {
            attribute: key,
            value
        }
    });

    const teiId = uid();

    return {
        trackedEntity: teiId,
        trackedEntityType,
        orgUnit,
        enrollments: [
            {
                enrollment: uid(),
                enrolledAt: new Date().toISOString(),
                occurredAt: new Date().toISOString(),
                trackedEntity: teiId,
                trackedEntityType,
                program,
                orgUnit,
                status: "ACTIVE",
                events: [],
                attributes,
            }
        ]
    }
}


function updateTei(data: Record<string, any>, tei: any) {
    const attributes = Object.entries(data).map(([key, value]) => {
        return {
            attribute: key,
            value
        }
    });
    return {
        ...tei,
        attributes
    };
}

function generateRelationship({parentConfig, parent, instance, instanceType}: {
    parentConfig: ParentConfig,
    parent: { id: string },
    instance: string,
    instanceType: string;
}) {

    const parentType = parentConfig.type === "program" ? "enrollment" : "event";
    const childType = instanceType === "program" ? "enrollment" : "event";

    return {
        relationship: uid(),
        relationshipType: parentConfig.id,
        from: {
            [parentType]: {
                [parentType]: parent.id
            }
        },
        to: {
            [childType]: {
                [childType]: instance
            }
        }
    }
}

export function generateEvent(data: Record<string, any>, {orgUnit, program, programStage, enrollment, trackedEntity}: {
    orgUnit: string;
    program: string;
    programStage: string;
    enrollment: string;
    trackedEntity: string;
}) {

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
        occurredAt: new Date().toISOString()
    }
}

export function updateEvent(data: Record<string, any>, event: any) {
    const dataValues = Object.entries(data).map(([key, value]) => {
        return {
            dataElement: key,
            value
        }
    });

    return {
        ...event,
        dataValues,
    }
}


export function useFormActions({instanceMetaId, type, instanceName, onComplete, parent, parentConfig, defaultValue}: {
    instanceName: string;
    instanceMetaId: string;
    type: "program" | "programStage",
    parentConfig?: ParentConfig,
    parent?: { id: string, instance: any },
    onComplete: () => void;
    defaultValue: any
}) {
    const {orgUnit} = useDimensions();
    const {instanceMeta} = useFormMeta({id: instanceMetaId, type});
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}));
    const [uploadPayload, {loading: saving}] = useDataMutation(mutation, {
        onComplete: () => {
            onComplete();
        },
        onError: () => {
            show({
                message: i18n.t("Failed to {{action}} {{name}}", {
                    name: instanceName,
                    action: defaultValue ? i18n.t("update") : i18n.t("create")
                }), type: {critical: true}
            })
        }
    });

    const onSave = useCallback(async (data: Record<string, any>) => {
        if (type === "program") {
            //Create a tei and enrollment
            if (defaultValue) {
                const enrollment = updateTei(data, defaultValue);
                delete enrollment['events']
                await uploadPayload({
                    data: {
                        enrollments: [
                            enrollment
                        ]
                    }
                })
                show({
                    message: i18n.t("Successfully updated {{name}}", {
                        name: instanceName
                    }), type: {success: true}
                });

            } else {
                const tei = generateTei(data, {
                    orgUnit: orgUnit?.id as string,
                    trackedEntityType: instanceMeta?.trackedEntityType?.id,
                    program: instanceMeta?.id as string
                });
                const payload = {
                    trackedEntities: [tei]
                }
                if (parent && parentConfig) {
                    const relationship = generateRelationship({
                        parentConfig,
                        parent,
                        instance: tei?.enrollments[0]?.enrollment,
                        instanceType: type
                    });
                    set(payload, ['relationships'], [relationship])
                }
                await uploadPayload({data: payload});
                show({
                    message: i18n.t("Successfully created {{name}}", {
                        name: instanceName
                    }), type: {success: true}
                });
            }
        } else {
            if (defaultValue) {
                const updatedEvent = updateEvent(data, defaultValue);
                await uploadPayload({
                    data: {
                        events: [
                            updatedEvent
                        ]
                    }
                })
                show({
                    message: i18n.t("Successfully updated {{name}}", {
                        name: instanceName
                    }), type: {success: true}
                });
            } else {
                if (!parent || !parentConfig) {
                    throw new Error("Parent instance is required for events");
                }
                let trackedEntity;
                let enrollment;

                if (parentConfig?.type === "program") {
                    //Parent instance is a tracked entity
                    trackedEntity = parent.instance.trackedEntity;
                    enrollment = get(parent.instance, ['enrollments', 0, 'enrollment'], '');
                } else {
                    //Parent instance is an event
                    enrollment = parent.instance.enrollment;
                    trackedEntity = parent.instance.trackedEntity;
                }

                const event = generateEvent(data, {
                    orgUnit: orgUnit?.id as string,
                    program: instanceMeta?.program?.id as string,
                    programStage: instanceMeta?.id as string,
                    trackedEntity,
                    enrollment
                });
                const relationship = generateRelationship({
                    parentConfig,
                    parent,
                    instance: event.event,
                    instanceType: type
                })

                const payload = {
                    events: [event],
                    relationships: [relationship]
                }
                await uploadPayload({data: payload});
                show({
                    message: i18n.t("Successfully created {{name}}", {
                        name: instanceName
                    }), type: {success: true}
                });
            }
        }
    }, [instanceMeta, orgUnit, uploadPayload, type]);
    const update = useCallback((data: Record<string, any>) => {
    }, []);

    return {
        onSave,
        saving,
        update,
    }
}

export function useDeleteInstance(type: "program" | "programStage", {instanceName}: {
    instanceName: string
}) {
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}));
    const [uploadPayload, {loading: deleting}] = useDataMutation(mutation, {
        onComplete: () => {
            show({
                message: i18n.t("Successfully deleted {{instanceName}}", {
                    instanceName
                }), type: {success: true}
            })
        },
        onError: (error) => {
            show({message: `${i18n.t("Failed to delete")}: ${error.message}`, type: {critical: true}}
            )
        }
    })
    const onDelete = useCallback(async (defaultValue: any) => {
        const payload = type === "program" ? {
            enrollments: [{
                enrollment: defaultValue.enrollment
            }]
        } : {
            events: [{
                event: defaultValue.event
            }]
        }
        await uploadPayload({
            data: payload,
            strategy: "DELETE"
        })
    }, [])

    return {
        deleting,
        onDelete
    }
}
