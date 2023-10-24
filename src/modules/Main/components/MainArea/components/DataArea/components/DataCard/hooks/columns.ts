import { useConfiguration } from '../../../../../../../../../shared/hooks/config'
import { useCallback, useEffect, useMemo } from 'react'
import {
    type ActionTrackingColumnStateConfig,
    ColumnState,
    type ColumnStateConfig,
    VisibleColumnState
} from '../state/columns'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { useWindowSize } from 'usehooks-ts'
import { useDimensions, usePageType } from '../../../../../../../../../shared/hooks'
import { BasePeriod, PeriodTypeCategory, PeriodUtility } from '@hisptz/dhis2-utils'
import i18n from '@dhis2/d2-i18n'
import { clamp, compact, flatten, range, uniqBy } from 'lodash'

/*
* Generates tracking columns based on the selected period and configured tracking frequency
*
* How tracking periods are obtained:
*  - For the selected period, figure out if the start and end date are on the same year
*  - If on the same year then generate periods of the type configured as tracking
*  - Then filter out periods that don't fall into the selected period
*  - If the start and end date are not on the same year, get a list of years the period falls into
*  - Then for each year generate the periods of the type configured as tracking
*  - Flatten the list
*  - Then filter out periods that don't fall into the selected period
*
*  */

export function useTrackingPeriods () {
    const { config } = useConfiguration()
    const { period } = useDimensions()
    return useMemo(() => {
        const { general } = config ?? {}
        const periodTypeId = general?.period.tracking
        const planningPeriodTypeId = general?.period.planning

        if (periodTypeId === planningPeriodTypeId) {
            return compact([period])
        }
        if (!periodTypeId || !period) return []

        let periods: BasePeriod[] = []

        if (period.start.year === period.end.year) {
            periods = new PeriodUtility().setYear(period.start.year as number).setCategory(PeriodTypeCategory.FIXED).getPeriodType(periodTypeId)?.periods ?? []
        } else {
            periods = compact(flatten(range(period.start.year, period.end.year + 1).map((year) => {
                return new PeriodUtility().setYear(year).setCategory(PeriodTypeCategory.FIXED).getPeriodType(periodTypeId)?.periods
            }) ?? [])) ?? []
        }
        return compact(uniqBy(periods, 'id').filter((pe) => period?.interval.contains(pe.start) && period?.interval.contains(pe.end))) ?? []
    }, [period, config])
}

export function useTrackingColumns () {
    const { config } = useConfiguration()
    const type = usePageType()

    const { period } = useDimensions()

    const trackingPeriods = useTrackingPeriods()

    return useMemo(() => {
        if (type === 'planning') {
            return [{
                id: `latest-status`,
                width: 150,
                name: i18n.t('Latest status'),
                visible: true,
                from: 'tracking',
                period
            }] as ActionTrackingColumnStateConfig[]
        } else {
            return compact(trackingPeriods.map((period) => {
                const periodObject = period.get()
                if (!periodObject) {
                    return
                }
                return {
                    id: periodObject.id,
                    name: periodObject.name,
                    visible: true,
                    width: 0,
                    from: 'tracking',
                    period
                } as ActionTrackingColumnStateConfig
            }))
        }
    }, [type, trackingPeriods])
}

export function useSetColumnState () {
    const { width } = useWindowSize()
    const trackingColumns = useTrackingColumns()
    // This sets the initial state of the columns;
    const { config } = useConfiguration()
    const setDefaultColumnState = useSetRecoilState(ColumnState(config?.id as string))
    const tableHeaders = useMemo(() => {
        if (!config) {
            return []
        }
        const [, ...rest] = config.categories
        const categoriesHeaders = rest.map(category => {
            return category.fields.filter(({ showAsColumn }) => showAsColumn).map((field) => ({
                ...field,
                from: category.id
            }))
        }).flat()
        const actionsHeaders = config.action.fields.filter(({ showAsColumn }) => showAsColumn).map((field) => ({
            ...field,
            from: config.action.id
        }))
        const planningColumns = [...categoriesHeaders, ...actionsHeaders].map((header) => {
            return {
                id: header.id,
                visible: true,
                width: 150,
                name: header.name,
                from: header.from
            } as ColumnStateConfig
        })

        const columns = [
            ...planningColumns,
            ...trackingColumns
        ]

        const columnWidth = clamp((100 / columns.length), 10, 100)

        return columns.map((column) => {
            return {
                ...column,
                width: columnWidth
            }
        })
    }, [config, width, trackingColumns])
    useEffect(() => {
        setDefaultColumnState(tableHeaders)
    }, [width, trackingColumns])
}

export function useColumns () {
    const { config } = useConfiguration()
    return useRecoilValue(VisibleColumnState(config?.id as string))
}

export function useManageColumns () {
    const { config } = useConfiguration()
    const { width } = useWindowSize()
    const [columns, setColumns] = useRecoilState(ColumnState(config?.id as string))

    const manageColumns = useCallback((columns: ColumnStateConfig[]) => {
        setColumns(columns)
    }, [setColumns, width])

    return {
        columns,
        manageColumns
    }
}


