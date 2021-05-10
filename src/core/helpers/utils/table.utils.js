import _ from 'lodash'
import {ActionStatusTableCell, CustomTableCellWithActions} from "../../../modules/main/Components/Tables/CustomTable";
import React from "react";
import {getJSDate} from "./date.utils";

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
    let names = [];
    Object.values(tables).forEach(table => {
        table?.columns?.forEach(column => {
            if (column.visible) {
                names.push(column.displayName)
            }
        })
    })
    _.set(tables, 'visibleColumnsNames', names)
}

export function setTablesWidth(tables) {
    _.set(tables, 'gapsTable.width', ((100 / tables.visibleColumnsCount) * tables.gapsTable.visibleColumnsCount) || 0);
    _.set(tables, 'solutionsTable.width', ((100 / tables.visibleColumnsCount) * tables.solutionsTable.visibleColumnsCount) || 0);
    _.set(tables, 'actionsTable.width', ((100 / tables.visibleColumnsCount) * tables.actionsTable.visibleColumnsCount) || 0);
    _.set(tables, 'actionStatusTable.width', ((100 / tables.visibleColumnsCount) * tables.actionStatusTable.visibleColumnsCount) || 0);
}

export function getPeriodDates(quarter) {
    const {startDate: startDateString, endDate: endDateString} = quarter;
    const [start, startMonth, startYear] = startDateString.split('-');
    const [end, endMonth, endYear] = endDateString.split('-');
    const startDate = new Date(startYear, startMonth - 1, start);
    const endDate = new Date(endYear, endMonth - 1, end);
    return {startDate, endDate}
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
            const {startDate, endDate} = getPeriodDates(period);
            const actionStartDate = getJSDate(object.startDate);
            const actionEndDate = getJSDate(object.endDate);
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
                        disabled={startDate < actionStartDate || actionEndDate < endDate}
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
        const trackingPeriods = [...period[trackingPeriod.toLowerCase()]] || [];
        if (period) {
            if (period.type === trackingPeriod) {
                return [getColumn(period)]
            } else {
                return _.map(_.reverse(trackingPeriods), (p) => {
                    return getColumn(p);
                })
            }
        }
    }
    return []
}

export function setVisibility(visible = true, table = {}, names = ['']) {
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

export function setTrackingColumns(period = [], tables = {}, trackingPeriod) {
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
