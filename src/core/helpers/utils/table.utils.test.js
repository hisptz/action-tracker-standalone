import {
    updateTablesVisibleColumnsCount,
    getTableTrackingColumns,
    updateVisibleColumns,
    setTablesWidth,
    setTrackingColumns,
    updateVisibleColumnsCount,
    updateVisibleColumnsNames,
    resetColumnConfig,
    getPeriodDates,
    setVisibility
} from "./table.utils";
import {
    CustomTableCell,
    CustomTableCellWithActions,
    DueDateTableCell, StatusTableCell
} from "../../../modules/main/Components/Tables/CustomTable";
import React from "react";
import {Period} from "@iapps/period-utilities";


const initialTableConfiguration = {
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
                        <DueDateTableCell pastDate={object?.pastDueDate} style={{maxWidth: width}}
                                          dueDate={object?.endDate}
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


describe("Test updateTablesVisibleColumnsCount", () => {

    it('visible column count should be 8 when tracking is not set', () => {
        const updatedTableConfig = initialTableConfiguration;
        expect(updatedTableConfig.visibleColumnsCount).toBe(0)
        updateVisibleColumnsCount(updatedTableConfig);
        expect(updatedTableConfig.visibleColumnsCount).toBe(8)
    })
    it('visible column count should be 11 (7 + 4) when quarterly tracking is selected', () => {
        let updatedTableConfig = initialTableConfiguration;
        const period = new Period().setPreferences({allowFuturePeriods: true}).getById('2021');
        updatedTableConfig = setTrackingColumns(period, updatedTableConfig, 'Quarterly');
        updateVisibleColumnsCount(updatedTableConfig);
        expect(updatedTableConfig.visibleColumnsCount).toBe(11)
    })
    it('visible column count should be 19 (7 + 12) when monthly tracking is selected', () => {
        let updatedTableConfig = initialTableConfiguration;
        const period = new Period().setPreferences({allowFuturePeriods: true}).getById('2021');
        updatedTableConfig = setTrackingColumns(period, updatedTableConfig, 'Monthly');
        updateVisibleColumnsCount(updatedTableConfig);
        expect(updatedTableConfig.visibleColumnsCount).toBe(19)
    })

    it('should not throw an error when the argument is not provided', () => {
        expect(() => updateVisibleColumnsCount()).not.toThrow(Error)
    })

    it('should throw an error when the argument is not valid', () => {
        expect(() => updateVisibleColumnsCount({count: 0})).toThrow(Error('Invalid table configuration provided.'))
    })

})
describe("Test getTableTrackingColumns", () => {

})
describe("Test updateVisibleColumns", () => {

})
describe("Test setTablesWidth", () => {

})
describe("Test setTrackingColumns", () => {

})
describe("Test updateVisibleColumnsCount", () => {

})
describe("Test updateVisibleColumnsNames", () => {

})
describe("Test resetColumnConfig", () => {

})
describe("Test getPeriodDates", () => {

})
describe("Test setVisibility", () => {

})
