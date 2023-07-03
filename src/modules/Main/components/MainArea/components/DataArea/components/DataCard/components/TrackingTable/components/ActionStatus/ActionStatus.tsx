import {ActionTrackingColumnStateConfig} from "../../../../state/columns";
import React, {useMemo} from "react";
import {useDimensions} from "../../../../../../../../../../../../shared/hooks";
import {find, get} from "lodash";
import {DateTime} from "luxon";
import {Button, IconAdd24} from "@dhis2/ui"
import {useBoolean} from "usehooks-ts";
import {ActionStatusForm} from "./components/ActionStatusForm";
import {useConfiguration} from "../../../../../../../../../../../../shared/hooks/config";
import i18n from '@dhis2/d2-i18n';

export interface ActionStatusProps {
    refetch: () => void;
    instance: any,
    events: any[]
    columnConfig: ActionTrackingColumnStateConfig
}


export function ActionStatus({instance, columnConfig, events, refetch}: ActionStatusProps) {
    const {value: hide, setTrue: onHide, setFalse: onShow} = useBoolean(true);
    const {period: selectedPeriod} = useDimensions();
    const {config} = useConfiguration();
    const {period} = columnConfig;

    const statusEvent = useMemo(() => {
        if (!events) return null;
        return find(events, (event) => {
            const date = new Date(event.occurredAt);
            return period.interval.contains(DateTime.fromJSDate(date));
        }) as any ?? null;
    }, [instance, period, events]);

    //TODO: Discuss if this is how it should be...
    if (!selectedPeriod?.interval.engulfs(period.interval)) {
        return null;
    }

    const tableData = useMemo(() => {
        if (!statusEvent) return null;
        const dataValues = get(statusEvent, ['dataValues'], null);

        const data = dataValues.map((dataValue: { dataElement: string; value: string }) => {
            const dataElement = find(config?.action.statusConfig.fields, {id: dataValue.dataElement});
            return {
                name: dataElement?.name,
                value: dataValue.value
            }
        })

        return [
            {
                name: i18n.t("Review Date"),
                value: DateTime.fromISO(statusEvent.occurredAt).toFormat("dd-MM-yyyy")
            },
            ...data
        ]

    }, [statusEvent,])

    const onActionManageComplete = () => {
        refetch()
    }


    if (!statusEvent) {
        return (
            <>
                <ActionStatusForm onComplete={onActionManageComplete} columnConfig={columnConfig} onClose={onHide}
                                  hide={hide} instance={instance}/>
                <div className="w-100 h-100 column center align-center">
                    <Button onClick={onShow} icon={<IconAdd24/>}/>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="w-100 h-100 column gap-8 pv-8">
                {
                    tableData?.map((dataValue: any) => (
                        <>
                            <b className="m-0">{dataValue.name}</b>
                            <span className="m-0">{dataValue.value}</span>
                        </>
                    ))
                }
            </div>
        </>
    )
}
