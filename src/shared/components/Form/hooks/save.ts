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
    params: {
        importStrategy: 'CREATE_AND_UPDATE',
        importMode: 'COMMIT',
        async: false,
        validationMode: 'FAIL_FAST'
    }
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

function generateEvent(data: Record<string, any>, {orgUnit, program, programStage, enrollment, trackedEntity}: {
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


export function useFormActions({instanceMetaId, type, instanceName, onComplete, parent, parentConfig}: {
    instanceName: string;
    instanceMetaId: string;
    type: "program" | "programStage",
    parentConfig?: ParentConfig,
    parent?: { id: string, instance: any },
    onComplete: () => void;
}) {
    const {orgUnit} = useDimensions();
    const {instanceMeta} = useFormMeta({id: instanceMetaId, type});
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}));
    const [uploadPayload, {loading: createTeiLoading}] = useDataMutation(mutation, {
        onComplete: () => {
            show({
                message: i18n.t("Successfully created {{name}}", {
                    name: instanceName
                }), type: {success: true}
            });
            onComplete();
        },
        onError: () => {
            show({
                message: i18n.t("Failed to create {{name}}", {
                    name: instanceName
                }), type: {critical: true}
            })
        }
    });

    const create = useCallback(async (data: Record<string, any>) => {
        if (type === "program") {
            //Create a tei and enrollment
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
                console.log(parent.instance)
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

        }
    }, [instanceMeta, orgUnit, uploadPayload, type]);
    const update = useCallback((data: Record<string, any>) => {
    }, []);

    return {
        create,
        creating: createTeiLoading,
        update,
    }
}
