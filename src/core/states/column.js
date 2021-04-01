import {selector, atom} from "recoil";
import {PageState} from "./page";
import {DimensionsState} from "./dimensions";
import getTableQuartersColumn, {setVisibility} from "../services/tableUtils";
import {
    CustomTableCell,
    CustomTableCellWithActions,
    DueDateTableCell,
    StatusTableCell
} from "../../modules/main/Components/Tables/CustomTable";
import _ from 'lodash';
import React from "react";

const defaultTables = {
    visibleColumnsCount: 0,
    visibleColumnsNames: [],
    gapsTable: {
        width: 0,
        columns: [
            {
                name: 'gap',
                displayName: 'Gap',
                mandatory: true,
                visible: true,
                width: 0,
                render: (object, actions = {
                    onEdit: () => {
                    },
                    onDelete: () => {
                    },
                    ref: undefined,
                    setRef: () => {
                    }
                }) => {
                    const {ref} = actions || {};
                    return (
                        <CustomTableCellWithActions key={`${object.id}-custom-table-cell-action`}
                                                    object={object} {...actions} reference={ref}>
                            {object.description}
                        </CustomTableCellWithActions>
                    )
                }
            },
            {
                name: 'orgUnit',
                displayName: 'Org Unit',
                mandatory: true,
                visible: true,
                width: 0,
                render: (object) => {
                    return (
                        <CustomTableCell key={`${object.id}-custom-table-cell-orgunit`}>
                            {object?.orgUnitName}
                        </CustomTableCell>
                    )
                }
            },
        ],
        visibleColumnsCount: 2,
        visible: true
    },
    solutionsTable: {
        width: 0,
        columns: [
            {
                name: 'possibleSolution',
                displayName: 'Possible Solutions',
                mandatory: true,
                visible: true,
                width: 0,
                render: (object, actions = {
                    onEdit: () => {
                    },
                    onDelete: () => {
                    },
                    ref: undefined,
                    setRef: () => {
                    }
                }) => {
                    const {ref} = actions || {};
                    return (
                        <CustomTableCellWithActions key={`${object.id}-custom-table-cell-action`}
                                                    object={object} {...actions}
                                                    reference={ref}>
                            {object?.solution}
                        </CustomTableCellWithActions>
                    )
                }
            },
        ],
        visibleColumnsCount: 1,
        visible: true
    },
    actionsTable: {
        width: 0,
        columns: [
            {
                name: 'action',
                displayName: 'Action Items',
                mandatory: true,
                visible: true,
                width: 0,
                render: (object, _, __, width) => {
                    return (
                        <CustomTableCell style={{maxWidth: width}} key={`${object.id}-description`}>
                            {object?.description}
                        </CustomTableCell>
                    )
                }
            },
            {
                name: 'responsiblePerson',
                displayName: 'Responsible Person',
                mandatory: true,
                visible: true,
                width: 0,
                render: (object, _, __, width) => {
                    return (
                        <CustomTableCell style={{maxWidth: width}} key={`${object.id}-responsible-designation`}>
                            {object?.responsiblePerson}, {object?.designation}
                        </CustomTableCell>
                    )
                }
            },
            {
                name: 'startDate',
                displayName: 'Start Date',
                mandatory: true,
                visible: true,
                width: 0,
                render: (object, _, __, width) => {
                    return (
                        <CustomTableCell style={{maxWidth: width}} key={`${object.id}-startDate`}>
                            {object?.startDate}
                        </CustomTableCell>
                    )
                }
            },
            {
                name: 'endDate',
                displayName: 'End Date',
                mandatory: true,
                visible: true,
                width: 0,
                render: (object, _, __, width) => {
                    return (
                        <DueDateTableCell style={{maxWidth: width}} dueDate={object?.endDate}
                                          key={`${object.id}-endDate`}/>
                    )
                }
            },
            {
                name: 'status',
                displayName: 'Status',
                mandatory: true,
                visible: true,
                width: 0,
                render: (object, refetch, actions, width) => {
                    const {ref} = actions || {};
                    return (
                        <StatusTableCell
                            style={{maxWidth: width}}
                            object={object}
                            reference={ref}
                            {...actions}
                            status={object?.latestStatus}
                            key={`${object.id}-latestStatus`}
                        />
                    )
                }
            },
        ],
        visibleColumnsCount: 5,
        visible: true
    },
    actionStatusTable: {
        width: 0,
        visible: false,
        visibleColumnsCount: 4,
        columns: []
    }
}

export const TableState = atom({
    key: 'tables',
    default: {}
})

export const ColumnState = selector(({
    key: 'liveColumn',
    get: ({get}) => {
        const activePage = get(PageState);
        const {period} = get(DimensionsState);

        function updateTablesVisibleColumnsCount(tables) {
            _.set(tables, 'gapsTable.visibleColumnsCount', _.filter(tables.gapsTable.columns, 'visible').length)
            _.set(tables, 'solutionsTable.visibleColumnsCount', _.filter(tables.solutionsTable.columns, 'visible').length)
            _.set(tables, 'actionsTable.visibleColumnsCount', _.filter(tables.actionsTable.columns, 'visible').length)
            _.set(tables, 'actionStatusTable.visibleColumnsCount', _.filter(tables.actionStatusTable.columns, 'visible').length)
        }

        function updateVisibleColumnsCount(tables) {
            let count = 0;
            Object.values(tables).forEach(table => {
                if (table.visibleColumnsCount) {
                    count += table.visibleColumnsCount;
                }
            })
            _.set(tables, 'visibleColumnsCount', count);
        }

        function updateVisibleColumnsNames(tables) {
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

        function setTablesWidth(tables) {
            _.set(tables, 'gapsTable.width', ((100 / tables.visibleColumnsCount) * tables.gapsTable.visibleColumnsCount));
            _.set(tables, 'solutionsTable.width', ((100 / tables.visibleColumnsCount) * tables.solutionsTable.visibleColumnsCount));
            _.set(tables, 'actionsTable.width', ((100 / tables.visibleColumnsCount) * tables.actionsTable.visibleColumnsCount));
            _.set(tables, 'actionStatusTable.width', ((100 / tables.visibleColumnsCount) * tables.actionStatusTable.visibleColumnsCount));
        }

        function updateVisibleColumns(tables) {
            updateTablesVisibleColumnsCount(tables);
            updateVisibleColumnsCount(tables);
            updateVisibleColumnsNames(tables);
            setTablesWidth(tables);
        }

        function resetColumnConfig() {
            const tables = defaultTables;
            updateVisibleColumns(tables);
            return {...tables};
        }

        if (activePage === 'Tracking') {
            let tables = defaultTables;
            const quarterColumns = getTableQuartersColumn(period[0]);
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
                return resetColumnConfig();
            }
        } else {
            return resetColumnConfig();
        }
    },
}))
