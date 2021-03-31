import {atom, selector} from "recoil";
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

export const TablesState = atom({
    key: 'tables',
    default: {
        visibleColumnsCount: 8,
        visibleColumnsNames: [],
        gapsTable: {
            columns: [
                {
                    name: 'gap',
                    displayName: 'Gap',
                    mandatory: true,
                    visible: true,
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
                    render: (object) => {
                        console.log(object.orgUnit);
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
            columns: [
                [
                    {
                        name: 'possibleSolution',
                        displayName: 'Possible Solutions',
                        mandatory: true,
                        visible: true,
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
                ]
            ],
            visibleColumnsCount: 1,
            visible: true
        },
        actionsTable: {
            columns: [
                {
                    name: 'action',
                    displayName: 'Action Items',
                    mandatory: true,
                    visible: true,
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
            visible: false,
            visibleColumnsCount: 4,
            columns: []
        }
    }
});

export const LiveColumnState = selector(({
    key: 'liveColumn',
    get: ({get}) => {
        const activePage = get(PageState);
        const {period} = get(DimensionsState);
        let tables = {...get(TablesState)};

        function updateVisibleColumnsCount() {
            let count = 0;
            Object.values(tables).forEach(table => {
                if (table.visibleColumnsCount) {
                    count += table.visibleColumnsCount;
                }
            })
            tables = {...tables, visibleColumnsCount: count}
        }

        function updateVisibleColumnsNames() {
            let names = [];
            Object.values(tables).forEach(table => {
                table?.columns?.forEach(column => {
                    if (column.visible) {
                        names.push(column.displayName)
                    }
                })
            })
            tables = {...tables, visibleColumnsNames: names}
        }

        function updateVisibleColumns() {
            updateVisibleColumnsCount();
            updateVisibleColumnsNames();
        }

        function resetColumnConfig() {
            tables = get(TablesState);
            updateVisibleColumns();
        }

        function setQuartersColumns() {
            const quarterColumns = getTableQuartersColumn(period[0]);
            if (quarterColumns && !_.isEmpty(quarterColumns)) {
                _.set(tables, 'actionStatusTable.columns', quarterColumns)
                _.set(tables, '.actionStatusTable.visibleColumnsCount', 4)
                _.set(tables, '.actionStatusTable.visible', true);
                setVisibility(false, tables.actionsTable, ['status']);
            }
            updateVisibleColumns();
        }

        updateVisibleColumns();

        if (activePage === 'Tracking') {
            setQuartersColumns();
            return tables;
        } else {
            resetColumnConfig();
            return tables;
        }
    }
}))
