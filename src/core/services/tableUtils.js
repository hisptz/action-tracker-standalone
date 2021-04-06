import {Period} from "@iapps/period-utilities";
import _ from 'lodash'
import {ActionStatusTableCell, CustomTableCellWithActions} from "../../modules/main/Components/Tables/CustomTable";
import React from "react";

export default function getTableQuartersColumn(period) {
    if (period) {
        const periodInstance = new Period();
        const {quarterly} = periodInstance.getById(period.id) || {};
        if (quarterly) {
            return _.map(_.reverse(quarterly), quarter => {
                return {
                    name: quarter.name,
                    displayName: quarter.name,
                    visible: true,
                    mandatory: true,
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
        let columns = _.filter(modifiedTable.columns, (col)=>col.name !== name);
        columns.push(modifiedColumn);
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
