import {SingleSelectField, SingleSelectOption} from '@dhis2/ui';
import _ from 'lodash';
import React, {useMemo} from 'react';
import {PeriodType} from "@iapps/period-utilities";
import i18n from '@dhis2/d2-i18n'



export default function CustomPeriodEditor({label, exclude = [], onChange, value, error, saving}) {

    const filteredPeriodTypes = useMemo(() => _.differenceWith(_.filter(new PeriodType().get(), ({name}) => !name.toLowerCase().includes('relative')), exclude, (period, periodName) => period.name === periodName.name), [exclude])
    return (
        <SingleSelectField dataTest={`${label}-select`} validationText={error?.message || error?.toString()} disabled={saving} selected={value}
                           filterable label={label} onChange={onChange}>
            {
                _.map(filteredPeriodTypes, (periodType) => <SingleSelectOption dataTest={`${periodType?.name}-option`}
                                                                               key={`${periodType?.name}-option`}
                                                                               label={i18n.t('{{label}}', {label: periodType.name})}
                                                                               value={periodType?.name}/>)
            }
        </SingleSelectField>
    )
}
