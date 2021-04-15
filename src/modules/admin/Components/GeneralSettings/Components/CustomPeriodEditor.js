import {SingleSelectField, SingleSelectOption} from '@dhis2/ui';
import _ from 'lodash';
import React from 'react';
import periodTypes from "../../../../../core/constants/periodTypes";


export default function CustomPeriodEditor({label, exclude = [], onChange, value}) {

    const filteredPeriodTypes = _.differenceWith(periodTypes, exclude, (period, periodName) => period.name === periodName);
    return (
        <SingleSelectField selected={value}  filterable label={label} onChange={onChange}>
            {
                _.map(filteredPeriodTypes, (periodType) => <SingleSelectOption label={periodType?.name}
                                                                               value={periodType?.name}/>)
            }
        </SingleSelectField>
    )
}
