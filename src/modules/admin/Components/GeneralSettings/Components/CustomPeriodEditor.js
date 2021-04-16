import {SingleSelectField, SingleSelectOption} from '@dhis2/ui';
import _ from 'lodash';
import React from 'react';
import {PeriodType} from "@iapps/period-utilities";


export default function CustomPeriodEditor({label, exclude = [], onChange, value, error, saving}) {

    const filteredPeriodTypes = _.differenceWith(new PeriodType().get(), exclude, (period, periodName) => period.name === periodName.name);
    return (
        <SingleSelectField validationText={error?.message || error?.toString()} disabled={saving} selected={value} filterable label={label} onChange={onChange}>
            {
                _.map(filteredPeriodTypes, (periodType) => <SingleSelectOption key={`${periodType?.name}-option`}
                                                                               label={periodType?.name}
                                                                               value={periodType?.name}/>)
            }
        </SingleSelectField>
    )
}
