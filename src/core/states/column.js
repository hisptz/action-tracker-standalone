import {atom, selector} from "recoil";
import {PageState} from "./page";
import {DimensionsState} from "./dimensions";
import {resetColumnConfig, setTrackingColumns} from "../services/tableUtils";
import {
    CustomTableCell,
    CustomTableCellWithActions,
    DueDateTableCell,
    StatusTableCell
} from "../../modules/main/Components/Tables/CustomTable";
import React from "react";

const defaultTables = {
    visibleColumnsCount: 0,
    visibleColumnsNames: [],
    gapsTable: {
        width: 0,
        columns: [
            {
                name: 'gap',
                displayName: 'Bottleneck',
                mandatory: false,
                visible: true,
                width: 0,
                render: (object, actions = {
                    onEdit: () => {
                    },
                    onDelete: () => {
                    },
                    ref: undefined,
                    setRef: () => {
                    },
                    roles: {}
                }) => {
                    const {ref} = actions || {};
                    return (
                        <CustomTableCellWithActions key={`${object.id}-custom-table-cell-action`}
                                                    object={object} {...actions} reference={ref}>
                            {object.title}
                        </CustomTableCellWithActions>
                    )
                }
            },
            {
                name: 'orgUnit',
                displayName: 'Org Unit',
                mandatory: false,
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
                mandatory: false,
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
                            {object?.title}
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
                mandatory: false,
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
    default: resetColumnConfig(defaultTables)
});


export const TableStateSelector = selector({
    key: 'table-state-selector',
    get: ({get}) => {
        const activePage = get(PageState);
        const {period} = get(DimensionsState);
        const tables = get(TableState);
        if (activePage === 'Tracking') {
            return setTrackingColumns(period, tables);
        } else {
            return resetColumnConfig(tables);
        }
    }
})

