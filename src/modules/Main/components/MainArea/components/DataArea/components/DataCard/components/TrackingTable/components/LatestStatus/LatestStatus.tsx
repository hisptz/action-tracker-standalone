import React from 'react';
import {find, isEmpty, last, sortBy} from "lodash";
import i18n from '@dhis2/d2-i18n';
import {useConfiguration} from "../../../../../../../../../../../../shared/hooks/config";

export interface LatestStatusProps {
    events: any[];
}

export function LatestStatus({events}: LatestStatusProps) {
    const {config} = useConfiguration();

    const actionStatusConfig = config?.action.statusConfig;

    if (isEmpty(events)) {
        return (
            <div className="w-100 h-100">
                {i18n.t("N/A")}
            </div>
        )
    }

    const latestStatusEvent = last(sortBy(events, (event) => new Date(event.occurredAt)));

    if (!latestStatusEvent) {
        return (
            <div className="w-100 h-100">
                {i18n.t("N/A")}
            </div>
        )
    }
    const status = find(latestStatusEvent.dataValues, ['dataElement', actionStatusConfig?.stateConfig?.dataElement])?.value;

    return (
        <div className="w-100 h-100">
            {status}
        </div>
    )
}
