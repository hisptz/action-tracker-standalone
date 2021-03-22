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
import React from "react";

export const ColumnState = atom({
    key: 'columns',
    default: {
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
                        <CustomTableCellWithActions object={object} {...actions} reference={ref}/>
                    )
                }
            },
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
                        <CustomTableCellWithActions object={object} {...actions} reference={ref}/>
                    )
                }
            },
            {
                name: 'action',
                displayName: 'Action Items',
                mandatory: true,
                visible: true,
                render: object => {
                    return (
                        <CustomTableCell key={`${object.id}-description`}>
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
                render: object => {
                    return (
                        <CustomTableCell key={`${object.id}-responsible-designation`}>
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
                render: object => {
                    return (
                        <CustomTableCell key={`${object.id}-startDate`}>
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
                render: object => {
                    return (
                        <DueDateTableCell dueDate={object?.endDate}
                                          key={`${object.id}-endDate`}/>
                    )
                }
            },
            {
                name: 'status',
                displayName: 'Status',
                mandatory: true,
                visible: true,
                render: object => {
                    return (
                        <StatusTableCell status={object?.latestStatus}
                                         key={`${object.id}-latestStatus`}/>
                    )
                }
            },
        ],
        visibleColumnsCount: 7,
        gapsTable: [
            'gap'
        ],
        solutionsTable: [
            'possibleSolution'
        ],
        actionsTable: [
            'action',
            'responsiblePerson',
            'startDate',
            'endDate',
            'status'
        ]
    }
});

export const LiveColumnState = selector(({
    key: 'liveColumn',
    get: ({get}) => {
        const activePage = get(PageState);
        const {period} = get(DimensionsState);
        if (activePage === 'Tracking') {
            let columnsConfig = get(ColumnState);
            const quarterColumns = getTableQuartersColumn(period[0]);
            if (quarterColumns && quarterColumns.length > 0) {
                const cols = setVisibility(false, columnsConfig.columns, 'status');
                const columnsToDisplay = [...cols, ...quarterColumns];
                return {
                    ...columnsConfig,
                    visibleColumnsCount: _.filter(columnsToDisplay, ['visible', true]).length,
                    columns: columnsToDisplay,
                    actionsTable: [...columnsConfig.actionsTable, ...quarterColumns.map(col => col.name)]
                };
            } else {
                return get(ColumnState);
            }
        } else {
            return get(ColumnState);
        }
    }
}))
