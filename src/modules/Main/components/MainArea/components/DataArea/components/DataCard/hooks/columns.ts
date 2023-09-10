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
import { PeriodTypeCategory, PeriodUtility } from '@hisptz/dhis2-utils'
import i18n from '@dhis2/d2-i18n'
import { clamp, compact } from 'lodash'

export function useTrackingColumns () {
    const { config } = useConfiguration()
    const type = usePageType()

    const { period } = useDimensions()
    const trackingPeriods = useMemo(() => {
        const { general } = config ?? {}
        const periodTypeId = general?.period.tracking
        if (!periodTypeId) return []

        const periodType = new PeriodUtility().setCategory(PeriodTypeCategory.FIXED).setYear(period?.get()?.endDate.getFullYear() ?? new Date().getFullYear()).getPeriodType(periodTypeId)
        return periodType?.periods.filter((pe) => period?.interval.engulfs(pe.interval) || pe.start.diffNow('days').days <= 0) ?? []
    }, [])

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
