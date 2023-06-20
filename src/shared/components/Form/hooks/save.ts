import {useCallback, useMemo} from "react";
import {Event, TrackedEntityInstance} from "@hisptz/dhis2-utils";
import {useDataMutation} from "@dhis2/app-runtime";


const teiCreateMutation: any = {
    resource: "trackedEntityInstances",
    type: "create",
    data: ({data}: { data: TrackedEntityInstance }) => data,
}

const teiUpdateMutation: any = {
    resource: "trackedEntityInstances",
    type: "update",
    id: ({data}: { data: TrackedEntityInstance }) => data.trackedEntityInstance,
    data: ({data}: { data: TrackedEntityInstance }) => data,
}

const eventCreateMutation: any = {
    resource: "events",
    type: "create",
    data: ({data}: { data: Event }) => data,
}

const eventUpdateMutation: any = {
    resource: "events",
    type: "update",
    id: ({data}: { data: Event }) => data.event,
    data: ({data}: { data: Event }) => data,
}

export function useFormActions({}: { id: string; parent?: { type: "program" | "programStage", id: string } }) {
    const [createTei, {loading: createTeiLoading}] = useDataMutation(teiCreateMutation);
    const [createEvent, {loading: createEventLoading}] = useDataMutation(eventCreateMutation);
    const [updateTei, {loading: updateTeiLoading}] = useDataMutation(teiUpdateMutation);
    const [updateEvent, {loading: updateEventLoading}] = useDataMutation(eventUpdateMutation);


    const updating = useMemo(() => updateTeiLoading || updateEventLoading, [updateTeiLoading, updateEventLoading])
    const creating = useMemo(() => createTeiLoading || createEventLoading, [createTeiLoading, createEventLoading])

    const create = useCallback((data: Record<string, any>) => {
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
