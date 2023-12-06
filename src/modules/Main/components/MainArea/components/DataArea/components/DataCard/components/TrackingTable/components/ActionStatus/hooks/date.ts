import {
    TrackedEntity,
    WebapiControllerTrackerView_Event
} from '../../../../../../../../../../../../../shared/types/dhis2'
import { BasePeriod } from '@hisptz/dhis2-utils'
import { useConfiguration } from '../../../../../../../../../../../../../shared/hooks/config'
import { DateTime, Interval } from 'luxon'
import { Config } from '../../../../../../../../../../../../../shared/schemas/config'

function getCompleteOrCancelledStatus ({
                                           config,
                                           events,
                                           period
                                       }: {
    events: WebapiControllerTrackerView_Event[]
    config: Config,
    period: BasePeriod
}) {
    const statusDataElement = config.action.statusConfig.stateConfig.dataElement
    const completeStatusCode = config.action.statusConfig.stateConfig.completeOptionCode
    const cancelledStatusCode = config.action.statusConfig.stateConfig.cancelOptionCode

    return events.find((event) => {
        const status = event.dataValues.find((dataValue) => {
            return dataValue.dataElement === statusDataElement
        })
        return (status?.value === completeStatusCode || status?.value === cancelledStatusCode) && period.start.diff(DateTime.fromJSDate(new Date(event.occurredAt))).shiftTo('days').days > 0
    })

}

export function useShowActionTracking ({
                                           action,
                                           period,
                                           events
                                       }: {
    action: TrackedEntity,
    period: BasePeriod,
    events: WebapiControllerTrackerView_Event[]
}) {
    const { config } = useConfiguration()

    if (!config) {
        return
    }

    const completeOrCancelledStatus = getCompleteOrCancelledStatus({
        config,
        period,
        events
    })

    if (completeOrCancelledStatus) {
        return false
    }

    const actionConfigFields = config?.action.fields
    const startDateField = actionConfigFields?.find((field) => field.isStartDate)
    const endDateField = actionConfigFields?.find((field) => field.isEndDate)
    const actionStartDate = DateTime.fromJSDate(new Date(action.attributes.find(({ attribute }) => startDateField?.id === attribute)?.value as string))
    const actionEndDate = DateTime.fromJSDate(new Date(action.attributes.find(({ attribute }) => endDateField?.id === attribute)?.value as string))

    const periodsIntersect = period.interval.intersection(Interval.fromDateTimes(actionStartDate, actionEndDate))

    return !!periodsIntersect

}
