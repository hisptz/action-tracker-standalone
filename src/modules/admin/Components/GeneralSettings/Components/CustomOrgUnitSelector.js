import {useAlert, useDataQuery} from "@dhis2/app-runtime";
import {SingleSelectField, SingleSelectOption, InputField} from "@dhis2/ui";
import * as _ from "lodash";
import React from "react";
import i18n from '@dhis2/d2-i18n'


const orgUnitLevelsQuery = {
    orgUnitLevels: {
        resource: 'organisationUnitLevels',
        params: {
            fields: [
                'id',
                'displayName',
                'level'
            ]
        }
    }
}

export default function CustomOrgUnitSelector({onChange, value, savingError, saving, label}) {
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}));
    const {data, loading, error} = useDataQuery(orgUnitLevelsQuery, {
        onError: (e) => {
            show({message: e?.message || e?.toString(), type: {success: true}})
        }
    })
    const sortedOrgUnitLevels = _.sortBy(data?.orgUnitLevels?.organisationUnitLevels, ({level}) => level) || []

    return (
        loading ? <InputField loading={loading}  label={label} disabled={true}/> :
            <SingleSelectField dataTest={'planning-org-unit-level-select'} error={Boolean(error || savingError)}
                               validationText={(error?.message || error?.toString()) || (savingError?.message || savingError?.toString())}
                               disabled={loading || saving} loading={loading} selected={value}
                               filterable label={label} onChange={onChange}>
                {
                    _.map(sortedOrgUnitLevels, (orgUnitLevel) =>
                        <SingleSelectOption
                            dataTest={`${orgUnitLevel?.id}-option`}
                            key={`${orgUnitLevel?.id}-option`}
                            label={i18n.t('{{ orgUnitLevel }}', {orgUnitLevel: orgUnitLevel?.displayName})}
                            value={orgUnitLevel?.id}/>)
                }
            </SingleSelectField>
    )
}
