import {Period} from "@iapps/period-utilities";
import _ from 'lodash'
import {ActionStatusTableCell, CustomTableCellWithActions} from "../../modules/main/Components/Tables/CustomTable";
import React from "react";

export function updateTablesVisibleColumnsCount(tables) {
    _.set(tables, 'gapsTable.visibleColumnsCount', _.filter(tables.gapsTable.columns, 'visible').length || 0)
    _.set(tables, 'solutionsTable.visibleColumnsCount', _.filter(tables.solutionsTable.columns, 'visible').length || 0)
    _.set(tables, 'actionsTable.visibleColumnsCount', _.filter(tables.actionsTable.columns, 'visible').length || 0)
    _.set(tables, 'actionStatusTable.visibleColumnsCount', _.filter(tables.actionStatusTable.columns, 'visible').length || 0)
}

export function updateVisibleColumnsCount(tables) {
    let count = 0;
    Object.values(tables).forEach(table => {
        if (table.visibleColumnsCount) {
            count += table.visibleColumnsCount;
        }
    })
    _.set(tables, 'visibleColumnsCount', count);
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

export function getTableQuartersColumn(period) {
    if (period) {
        const periodInstance = new Period();
        const {quarterly} = periodInstance.getById(period.id) || {};
        if (quarterly) {
            return _.map(_.reverse(quarterly), (quarter) => {
                return {
                    name: quarter.name,
                    displayName: quarter.name,
                    visible: true,
                    mandatory: false,
                    id: quarter.id,
                    render: (object, refetch, actions) => {
                        const {ref, roles} = actions;
                        const {startDate, endDate} = getPeriodDates(quarter);
                        const actionStatusList = object.actionStatusList || [];
                        const actionStatus = _.filter(actionStatusList, (as => {
                            const eventDate = new Date(as.eventDate);
                            return startDate <= eventDate && endDate >= eventDate;
                        }))[0]
                        return (
                            actionStatus ?
                                <CustomTableCellWithActions key={`${actionStatus.id}-action-status-cell`}
                                                            object={actionStatus} reference={ref} {...actions} >
                                    <ActionStatusTableCell
                                        roles={roles}
                                        refetch={refetch} action={object}
                                        key={`${object.id}-${quarter.id}`}
                                        actionStatus={actionStatus}
                                    />
                                </CustomTableCellWithActions> :
                                <ActionStatusTableCell
                                    roles={roles}
                                    refetch={refetch} action={object}
                                    key={`${object.id}-${quarter.id}`}
                                    actionStatus={actionStatus}
                                />
                        )
                    }
                }
            })
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

export function getPeriodDates(quarter) {
    const {monthly} = quarter || {};
    const firstMonthId = _.last(monthly)?.id;
    const lastMonthId = _.head(monthly)?.id;
    if (firstMonthId && lastMonthId) {
        const startDate = new Date();
        startDate.setFullYear(firstMonthId.substring(0, 4), firstMonthId.substring(4) - 1, 1).toString();
        const endDate = new Date();
        endDate.setFullYear(lastMonthId.substring(0, 4), lastMonthId.substring(4) - 1, 1).toString();
        return {startDate, endDate}
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

export function setTrackingColumns(period = [], tables = {}) {
    const quarterColumns = getTableQuartersColumn(period[0], tables.actionStatusTable);
    if (quarterColumns && !_.isEmpty(quarterColumns)) {
        const actionsTable = setVisibility(false, tables.actionsTable, ['status']);
        tables = {
            ...tables,
            actionStatusTable: {
                ...tables.actionStatusTable,
                columns: quarterColumns,
                visible: true,
                visibleColumnsCount: quarterColumns.length
            },
            actionsTable
        };
        updateVisibleColumns(tables);
        return tables;
    } else {
        return resetColumnConfig(tables);
    }
}
