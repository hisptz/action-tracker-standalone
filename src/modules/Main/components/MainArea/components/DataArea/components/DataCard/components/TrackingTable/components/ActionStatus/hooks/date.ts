import { TrackedEntity } from '../../../../../../../../../../../../../shared/types/dhis2'
import { BasePeriod } from '@hisptz/dhis2-utils'
import { useConfiguration } from '../../../../../../../../../../../../../shared/hooks/config'
import { DateTime, Interval } from 'luxon'

export function useShowActionTracking ({
                                           action,
                                           period
                                       }: { action: TrackedEntity, period: BasePeriod }) {
    const { config } = useConfiguration()
    const actionConfigFields = config?.action.fields
    const startDateField = actionConfigFields?.find((field) => field.isStartDate)
    const endDateField = actionConfigFields?.find((field) => field.isEndDate)
    const actionStartDate = DateTime.fromJSDate(new Date(action.attributes.find(({ attribute }) => startDateField?.id === attribute)?.value as string))
    const actionEndDate = DateTime.fromJSDate(new Date(action.attributes.find(({ attribute }) => endDateField?.id === attribute)?.value as string))

    const periodsIntersect = period.interval.intersection(Interval.fromDateTimes(actionStartDate, actionEndDate))

    return !!periodsIntersect

}
