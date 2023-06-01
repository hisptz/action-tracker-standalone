import * as _ from "lodash"
import {ActionStatusTableCell, CustomTableCellWithActions} from "../../../modules/main/Components/Tables/CustomTable";
import React from "react";
import {getJSDate, isValidTrackingPeriod} from "./date.utils";
import i18n from '@dhis2/d2-i18n'
import {PeriodTypeCategory, PeriodUtility} from "@hisptz/dhis2-utils";

export function updateTablesVisibleColumnsCount(tables) {
    _.set(tables, 'gapsTable.visibleColumnsCount', _.filter(tables.gapsTable.columns, 'visible').length || 0)
    _.set(tables, 'solutionsTable.visibleColumnsCount', _.filter(tables.solutionsTable.columns, 'visible').length || 0)
    _.set(tables, 'actionsTable.visibleColumnsCount', _.filter(tables.actionsTable.columns, 'visible').length || 0)
    _.set(tables, 'actionStatusTable.visibleColumnsCount', _.filter(tables.actionStatusTable.columns, 'visible').length || 0)
}

export function updateVisibleColumnsCount(tables) {
    if (!_.isEmpty(tables)) {
        try {
            let count = 0;
            updateTablesVisibleColumnsCount(tables);
            Object.values(tables).forEach(table => {
                if (table.visibleColumnsCount) {
                    count += table.visibleColumnsCount;
                }
            })
            _.set(tables, 'visibleColumnsCount', count);
        } catch (e) {
            throw(Error('Invalid table configuration provided.'))
        }
    }
}

export function updateVisibleColumnsNames(tables) {
    if (tables) {
        if (typeof tables === 'object') {
            let names = [];
            Object.values(tables).forEach(table => {
                table?.columns?.forEach(column => {
                    if (column.visible) {
                        names.push(i18n.t('{{- displayName }}', {displayName: column.displayName}))
                    }
                })
            })
            _.set(tables, 'visibleColumnsNames', names)
        } else {
            throw Error('Invalid table configuration provided.')
        }
    }
}

export function setTablesWidth(tables = {}) {
    if (typeof tables === 'object') {
        _.set(tables, 'gapsTable.width', ((100 / tables.visibleColumnsCount) * tables.gapsTable.visibleColumnsCount) || 0);
        _.set(tables, 'solutionsTable.width', ((100 / tables.visibleColumnsCount) * tables.solutionsTable.visibleColumnsCount) || 0);
        _.set(tables, 'actionsTable.width', ((100 / tables.visibleColumnsCount) * tables.actionsTable.visibleColumnsCount) || 0);
        _.set(tables, 'actionStatusTable.width', ((100 / tables.visibleColumnsCount) * tables.actionStatusTable.visibleColumnsCount) || 0);
    } else {
        throw Error('Invalid arguments provided.')
    }
}


function getColumn(period) {
    return {
        name: period.name,
        displayName: period.name,
        visible: true,
        mandatory: false,
        id: period.id,
        render: (object, refetch, actions) => {
            const {ref, roles} = actions;

            const startDate = period.start.toJSDate();
            const endDate = period.end.toJSDate();
            const actionEndDate = getJSDate(object.endDate);
            const actionStartDate = getJSDate(object.startDate);
            const actionStatusList = object.actionStatusList || [];
            const actionStatus = _.filter(actionStatusList, (as => {
                const eventDate = new Date(as.eventDate);
                return startDate <= eventDate && endDate >= eventDate;
            }))[0]


            return (
                actionStatus ?
                    <CustomTableCellWithActions key={`${actionStatus?.id}-action-status-cell`}
                                                object={actionStatus} reference={ref} {...actions} >
                        <ActionStatusTableCell
                            startDate={startDate}
                            endDate={endDate}
                            roles={roles}
                            refetch={refetch} action={object}
                            key={`${object.id}-${period?.id}`}
                            actionStatus={actionStatus}
                        />
                    </CustomTableCellWithActions> :
                    <ActionStatusTableCell
                        disabled={!isValidTrackingPeriod({actionStartDate, actionEndDate, startDate, endDate})}
                        startDate={startDate}
                        endDate={endDate}
                        roles={roles}
                        refetch={refetch} action={object}
                        key={`${object.id}-${period?.id}`}
                        actionStatus={actionStatus}
                    />
            )
        }
    }
}

export function getTableTrackingColumns(period, trackingPeriod) {
    if (period && trackingPeriod) {
        if (period instanceof Object) {
            if (typeof trackingPeriod === 'string') {
                const periodType = new PeriodUtility().setCategory(PeriodTypeCategory.FIXED).setYear(period.year).getPeriodType(trackingPeriod.toUpperCase());
                const trackingPeriods = periodType.periods.filter((pe) => period.interval.contains(pe.start) && period.interval.contains(pe.end)).toReversed();
                if (!_.isEmpty(trackingPeriods)) {
                    if (period.type.id.toLowerCase() === trackingPeriod.toLowerCase()) {
                        return [getColumn(period)]
                    } else {
                        return _.map(_.reverse(trackingPeriods), (p) => {
                            return getColumn(p);
                        })
                    }
                }
            } else {
                throw Error('Invalid tracking period')
            }
        } else {
            throw Error('Invalid period')
        }
    }
    return []
}

export function setVisibility(visible = true, table, names = ['']) {
    if (table) {
        if (Object.keys(table).includes('columns')) {
            if (typeof visible === 'boolean') {
                if (Array.isArray(names)) {
                    let modifiedTable = {...table};
                    names.forEach(name => {
                        let columnIndex = _.findIndex(modifiedTable.columns, (col) => col.name === name);
                        const modifiedColumn = {...modifiedTable.columns[columnIndex], visible}
                        let columns = [...modifiedTable.columns];
                        columns[columnIndex] = modifiedColumn;
                        modifiedTable = {
                            ...modifiedTable,
                            columns
                        }
                    });
                    return modifiedTable;
                } else {
                    throw Error('Invalid column list provided.')
                }
            } else {
                throw Error('Invalid visible value provided.')
            }
        } else {
            throw Error('Invalid table configuration provided.')
        }
    }
}

export function updateVisibleColumns(tables) {
    updateTablesVisibleColumnsCount(tables);
    updateVisibleColumnsCount(tables);
    updateVisibleColumnsNames(tables);
    setTablesWidth(tables);
}

export function resetColumnConfig(tables) {
    updateVisibleColumns(tables);
    return {...tables};
}

export function setTrackingColumns(period, tables = {}, trackingPeriod) {
    if (period && !_.isEmpty(tables) && trackingPeriod) {
        const trackingColumns = getTableTrackingColumns(period, trackingPeriod);
        if (trackingColumns && !_.isEmpty(trackingColumns)) {
            const actionsTable = setVisibility(false, tables.actionsTable, ['status']);
            tables = {
                ...tables,
                actionStatusTable: {
                    ...tables.actionStatusTable,
                    columns: trackingColumns,
                    visible: true,
                    visibleColumnsCount: trackingColumns.length
                },
                actionsTable
            };
            updateVisibleColumns(tables);
            return tables;
        } else {
            return resetColumnConfig(tables);
        }
    }
}
