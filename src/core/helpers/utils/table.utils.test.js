import {
    getTableTrackingColumns,
    updateVisibleColumns,
    setTablesWidth,
    setTrackingColumns,
    updateVisibleColumnsCount,
    updateVisibleColumnsNames,
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
    it('should return an array', () => {
        const trackingColumns = getTableTrackingColumns(new Period().getById('2020'), 'Quarterly');
        expect(trackingColumns.length).toBeDefined()
    })
    it('should return 4 columns if Quarterly period is selected', () => {
        const trackingColumns = getTableTrackingColumns(new Period().getById('2020'), 'Quarterly');
        expect(trackingColumns.length).toBe(4)
    })
    it('should return 12 columns if Monthly period is selected', () => {
        const trackingColumns = getTableTrackingColumns(new Period().getById('2020'), 'Monthly');
        expect(trackingColumns.length).toBe(12)
    })
    it('should return empty array if tracking period selected is not supported', () => {
        const trackingColumns = getTableTrackingColumns(new Period().getById('2020'), 'BiMonthly');
        expect(trackingColumns).toEqual([])
    })
    it('should throw an error if parameters are invalid', () => {
        expect(() => getTableTrackingColumns('2020', 'Monthly')).toThrow(Error('Invalid period'))
        expect(() => getTableTrackingColumns(new Period().getById('2020'), 8908)).toThrow(Error('Invalid tracking period'))
    })
    it('should return an empty array if any of the parameters are missing', () => {
        const trackingColumns = getTableTrackingColumns(undefined, 'Quarterly');
        expect(trackingColumns).toEqual([])
        const otherTrackingColumns = getTableTrackingColumns(new Period().getById('2020'), undefined)
        expect(otherTrackingColumns).toEqual([])
    })
})
describe("Test setTablesWidth", () => {
    const tableConfiguration = initialTableConfiguration;
    updateVisibleColumnsCount(tableConfiguration);
    it('should populate width value on every visible table', () => {
        setTablesWidth(tableConfiguration);
        expect(tableConfiguration.actionsTable.width).not.toEqual(0);
        expect(tableConfiguration.gapsTable.width).not.toBe(0);
        expect(tableConfiguration.solutionsTable.width).not.toBe(0);
    })
    it('should throw an error if an invalid argument is provided', () => {
        expect(() => setTablesWidth('tables')).toThrow(Error)
    })
})
describe("Test setTrackingColumns", () => {
    it('should throw an error if arguments are invalid', () => {
        const tableConfiguration = initialTableConfiguration;
        expect(() => setTrackingColumns(2020, tableConfiguration, 'Monthly')).toThrow(Error);
        expect(() => setTrackingColumns(new Period().getById('2020'), tableConfiguration, 2589)).toThrow(Error);
        expect(() => setTrackingColumns(new Period().getById('2020'), 'tables', 'Monthly')).toThrow(Error);

    })
    it('should not throw an error if any argument is provided', () => {
        const tableConfiguration = initialTableConfiguration;
        expect(() => setTrackingColumns()).not.toThrow(Error);
        expect(() => setTrackingColumns(undefined, tableConfiguration, 'Monthly')).not.toThrow(Error);
        expect(() => setTrackingColumns(new Period().getById('2020'), undefined, 2589)).not.toThrow(Error);
        expect(() => setTrackingColumns(new Period().getById('2020'), tableConfiguration, undefined)).not.toThrow(Error);
    })
})
describe("Test updateVisibleColumnsCount", () => {
    it('should throw an error if arguments are invalid', () => {
        expect(() => updateVisibleColumnsCount('invalidArgument')).toThrow(Error);
    })
    it('should not throw an error if no argument is provided', () => {
        const tableConfig = initialTableConfiguration;
        updateVisibleColumnsCount(tableConfig);
        expect(tableConfig.solutionsTable.visibleColumnsCount).not.toBe(0)
        expect(tableConfig.gapsTable.visibleColumnsCount).not.toBe(0)
        expect(tableConfig.actionsTable.visibleColumnsCount).not.toBe(0)

    })
})
describe("Test updateVisibleColumnsNames", () => {
    it('should populate the columnName array', () => {
        const tableConfig = initialTableConfiguration;
        updateVisibleColumnsNames(tableConfig);
        expect(tableConfig.visibleColumnsNames).not.toBe([])
    })
    it('should populate the name array to have all names of visible columns', () => {
        let tableConfig = initialTableConfiguration;
        updateVisibleColumnsNames(tableConfig);
        expect(tableConfig.visibleColumnsNames.length).toBe(8)
        tableConfig = setTrackingColumns(new Period().getById('2020'), tableConfig, 'Quarterly');
        updateVisibleColumns(tableConfig)
        updateVisibleColumnsNames(tableConfig)
        expect(tableConfig.visibleColumnsNames.length).toBe(11)
        tableConfig = setTrackingColumns(new Period().getById('2020'), tableConfig, 'Monthly');
        updateVisibleColumnsNames(tableConfig)
        expect(tableConfig.visibleColumnsNames.length).toBe(19)

    })
    it('should throw an error if arguments are invalid', () => {
        expect(() => updateVisibleColumnsNames('table')).toThrow(Error('Invalid table configuration provided.'))
    })
    it('should not throw an error if no argument is provided', () => {
        expect(() => updateVisibleColumnsNames()).not.toThrow(Error)
    })
})
describe("Test setVisibility", () => {
    it('should alter visibility of the given column configuration', () => {
        const tableConfig = initialTableConfiguration;
        updateVisibleColumns(tableConfig);
        const updatedTable = setVisibility(false, tableConfig.gapsTable, ['orgUnit']);
        expect(updatedTable.columns[1].visible).toBe(false)
    })

    it('should throw an error if arguments are invalid', () => {
        const tableConfig = initialTableConfiguration;

        expect(() => setVisibility(true, {}, ['orgUnit'])).toThrow(Error('Invalid table configuration provided.'))
        expect(() => setVisibility(true, tableConfig.gapsTable, 'orgUnit')).toThrow(Error('Invalid column list provided.'))
        expect(() => setVisibility('true', tableConfig.gapsTable, ['orgUnit'])).toThrow(Error('Invalid visible value provided.'))
    })
    it('should not throw an error if no argument is provided', () => {
        expect(()=>setVisibility()).not.toThrow(Error)
    })
})
