import {useCallback, useMemo} from "react";
import {Event, TrackedEntityInstance, uid} from "@hisptz/dhis2-utils";
import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import {useFormMeta} from "./metadata";
import {useDimensions} from "../../../hooks";
import i18n from '@dhis2/d2-i18n';

const teiCreateMutation: any = {
    resource: "tracker",
    type: "create",
    data: ({data}: { data: TrackedEntityInstance }) => data,
}

const teiUpdateMutation: any = {
    resource: "tracker",
    type: "update",
    id: ({data}: { data: TrackedEntityInstance }) => data.trackedEntityInstance,
    data: ({data}: { data: TrackedEntityInstance }) => data,
}

const eventCreateMutation: any = {
    resource: "tracker/events",
    type: "create",
    data: ({data}: { data: Event }) => data,
}

const eventUpdateMutation: any = {
    resource: "tracker/events",
    type: "update",
    id: ({data}: { data: Event }) => data.event,
    data: ({data}: { data: Event }) => data,
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
        attributes,
        enrollments: [
            {
                enrollment: uid(),
                enrollmentDate: new Date().toISOString(),
                trackedEntity: teiId,
                program,
                orgUnit,
                status: "ACTIVE",
                events: []
            }
        ]
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


export function useFormActions({instanceMetaId, type, instanceName, onComplete}: {
    instanceName: string;
    instanceMetaId: string;
    type: "program" | "programStage",
    parent?: { type: "program" | "programStage", id: string },
    onComplete: () => void;
}) {
    const {orgUnit} = useDimensions();
    const {instanceMeta} = useFormMeta({id: instanceMetaId, type});
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}));
    const [createTei, {loading: createTeiLoading}] = useDataMutation(teiCreateMutation, {
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
    const [createEvent, {loading: createEventLoading}] = useDataMutation(eventCreateMutation, {
        onComplete: () => {
            show({
                message: i18n.t("Successfully created {{name}}", {
                    name: instanceName
                }), type: {success: true}
            })
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
    const [updateTei, {loading: updateTeiLoading}] = useDataMutation(teiUpdateMutation, {
        onComplete: () => {
            show({
                message: i18n.t("Successfully updated {{name}}", {
                    name: instanceName
                }), type: {success: true}
            })
            onComplete();

        },
        onError: () => {
            show({
                message: i18n.t("Failed to updated {{name}}", {
                    name: instanceName
                }), type: {critical: true}
            })
        }
    });
    const [updateEvent, {loading: updateEventLoading}] = useDataMutation(eventUpdateMutation, {
        onComplete: () => {
            show({
                message: i18n.t("Successfully updated {{name}}", {
                    name: instanceName
                }), type: {success: true}
            })
            onComplete();
        },
        onError: () => {
            show({
                message: i18n.t("Failed to updated {{name}}", {
                    name: instanceName
                }), type: {critical: true}
            })
        }
    });

    const updating = useMemo(() => updateTeiLoading || updateEventLoading, [updateTeiLoading, updateEventLoading])
    const creating = useMemo(() => createTeiLoading || createEventLoading, [createTeiLoading, createEventLoading])

    const create = useCallback(async (data: Record<string, any>) => {
        if (type === "program") {
            //Create a tei and enrollment
            const tei = generateTei(data, {
                orgUnit: orgUnit?.id as string,
                trackedEntityType: instanceMeta?.trackedEntityType?.id,
                program: instanceMeta?.id as string
            });
            await createTei({
                data: tei
            });
        } else {

        }
    }, []);
    const update = useCallback((data: Record<string, any>) => {
    }, []);

    return {
        create,
        creating,
        update,
        updating
    }
}
