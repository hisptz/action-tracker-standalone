import {Period} from "@iapps/period-utilities";
import _ from 'lodash'
import {ActionStatusTableCell} from "../../modules/main/Components/Tables/CustomTable";
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
                    render: (object, refetch) => {
                        const {startDate, endDate} = getPeriodDates(quarter);
                        const actionStatusList = object.actionStatusList || [];
                        const actionStatus = _.filter(actionStatusList, (as => {
                            const eventDate = new Date(as.eventDate);
                            return startDate <= eventDate && endDate >= eventDate;
                        }))[0]
                        return (
                            <ActionStatusTableCell refetch={refetch} action={object} key={`${object.id}-${quarter.id}`}
                                                   actionStatus={actionStatus}/>
                        )
                    }
                }
            })
        }
    }
    return []
}

export function setVisibility(visible = false, columns = [], name = '') {
    const targetColumn = _.find(columns, ['name', name]);
    const editedColumn = {...targetColumn, visible};
    const cols = [...columns];
    cols.splice(_.findIndex(columns, ['name', name]), 1, editedColumn);
    return cols;
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
