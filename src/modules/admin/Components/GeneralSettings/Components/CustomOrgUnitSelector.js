import {useAlert, useDataQuery} from "@dhis2/app-runtime";
import {SingleSelectField, SingleSelectOption, InputField} from "@dhis2/ui";
import _ from "lodash";
import React from "react";


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
            <SingleSelectField error={Boolean(error || savingError)}
                               validationText={(error?.message || error?.toString()) || (savingError?.message || savingError?.toString())}
                               disabled={loading || saving} loading={loading} selected={value}
                               filterable label={label} onChange={onChange}>
                {
                    _.map(sortedOrgUnitLevels, (orgUnitLevel) =>
                        <SingleSelectOption
                            key={`${orgUnitLevel?.id}-option`}
                            label={orgUnitLevel?.displayName}
                            value={orgUnitLevel?.id}/>)
                }
            </SingleSelectField>
    )
}
