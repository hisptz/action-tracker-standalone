import { useDataQuery } from '@dhis2/app-runtime'
import { useConfiguration } from '../../../../../../../../../../../shared/hooks/config'
import { useDimensions } from '../../../../../../../../../../../shared/hooks'
import { useMemo } from 'react'
import { WebapiControllerTrackerView_Event } from '../../../../../../../../../../../shared/types/dhis2'

const trackingQuery: any = {
    events: {
        resource: 'tracker/events',
        params: ({
                     trackedEntity,
                     program,
                     programStage,
                     start,
                     end
                 }: {
            trackedEntity: string;
            program: string;
            programStage: string;
            start: string;
            end: string;
        }) => {
            return {
                trackedEntity,
                program,
                programStage,
                occurredAfter: start,
                occurredBefore: end,
                paging: false
            }
        }
    }
}

type Response = {
    events: {
        instances: WebapiControllerTrackerView_Event[];
    }
}

export function useTrackingTableData ({ instance }: {
    instance: any;
}) {
    const { config } = useConfiguration()
    const { period } = useDimensions()
    const {
        loading,
        data,
        refetch
    } = useDataQuery<Response>(trackingQuery, {
        variables: {
            program: instance.program,
            programStage: config?.action.statusConfig?.id,
            trackedEntity: instance.trackedEntity,
            start: period?.start.toFormat('yyyy-MM-dd'),
            end: period?.end.toFormat('yyyy-MM-dd')
        }
    })

    const events = useMemo(() => data?.events?.instances ?? [], [data?.events])

    return {
        loading,
        events,
        refetch
    }

}
