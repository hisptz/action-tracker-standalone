import React from 'react';
import {isEmpty, sortBy} from "lodash";
import i18n from '@dhis2/d2-i18n';

export interface LatestStatusProps {
    events: any[];
}

export function LatestStatus({events}: LatestStatusProps) {

    if (isEmpty(events)) {
        return (
            <div className="w-100 h-100">
                {i18n.t("N/A")}
            </div>
        )
    }

    const latestStatus = sortBy(events, (event) => new Date(event.occurredAt))

    console.log(latestStatus);

    return (
        <div className="w-100 h-100">
            {

            }
        </div>
    )
}
