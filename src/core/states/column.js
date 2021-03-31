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
import useOrganisationUnit from "../hooks/organisationUnit";
import {CircularLoader}  from '@dhis2/ui';

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
                mandatory: false,
                visible: false,
                render: (object) => {
                    console.log(object.orgUnit);
                    return (
                        <CustomTableCell key={`${object.id}-custom-table-cell-orgunit`}>
                            {object?.orgUnitName}
                        </CustomTableCell>
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
                        <CustomTableCellWithActions key={`${object.id}-custom-table-cell-action`}
                                                    object={object} {...actions}
                                                    reference={ref}>
                            {object?.solution}
                        </CustomTableCellWithActions>
                    )
                }
            },
            {
                name: 'action',
                displayName: 'Action Items',
                mandatory: true,
                visible: true,
                render: (object, _,__, width) => {
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
                render: (object, _,__, width)=> {
                    return (
                        <CustomTableCell style={{maxWidth: width}}  key={`${object.id}-responsible-designation`}>
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
                render: (object, _,__, width) => {
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
                render: (object, _,__, width) => {
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
        visibleColumnsCount: 8,
        gapsTable: [
            'gap',
            // 'orgUnit'
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
                const columnConfig =  get(ColumnState);
                return{
                    ...columnConfig,
                    visibleColumnsCount: _.filter(columnConfig.columns, ['visible', true]).length,
                }
            }
        } else {
            const columnConfig =  get(ColumnState);
            return{
                ...columnConfig,
                visibleColumnsCount: _.filter(columnConfig.columns, ['visible', true]).length,
            }
        }
    }
}))
