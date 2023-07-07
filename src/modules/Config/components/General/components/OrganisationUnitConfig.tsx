import React, {useMemo} from 'react'
import i18n from '@dhis2/d2-i18n';
import {RHFCheckboxField, RHFDHIS2FormField, RHFSingleSelectField} from "@hisptz/dhis2-ui";
import {useWatch} from "react-hook-form";
import {useDataQuery} from "@dhis2/app-runtime";


const query = {
    levels: {
        resource: "organisationUnitLevels",
        params: {
            fields: ["id", "level", "displayName"],
            paging: false
        }
    }
}

function OrgUnitPlanning() {
    const {data, loading} = useDataQuery<{
        levels: { organisationUnitLevels: { id: string, level: number, displayName: string }[] }
    }>(query, {})
    const namespace = `general.orgUnit.planning`;
    const [enabled] = useWatch({
        name: [`${namespace}.enabled`]
    });

    const options = useMemo(() => {
        if (loading) return []
        return data?.levels?.organisationUnitLevels.map(level => ({
            label: `${level.displayName} (${level.level})`,
            value: level.id
        })) ?? []
    }, [loading, data])

    return (
        <>
            <RHFCheckboxField label={i18n.t("Limit planning of actions to specific organisation unit levels")}
                              name={`${namespace}.enabled`}/>
            {
                enabled && (
                    <RHFSingleSelectField
                        loading={loading}
                        required
                        disabled={!enabled}
                        label={i18n.t("Planning organisation unit level")}
                        options={options}
                        name={`${namespace}.levels`}
                    />
                )
            }
        </>
    )
}

export function OrganisationUnitConfig() {
    const namespace = `general.orgUnit`

    return (
        <div className="column gap-8">
            <span>{i18n.t("Access")}</span>
            <RHFCheckboxField
                label={i18n.t("Allow access to all organisation units")}
                name={`${namespace}.accessAll`}
            />
            <span>{i18n.t("Planning")}</span>
            <OrgUnitPlanning/>
            <RHFDHIS2FormField
                label={i18n.t("Default organisation unit")}
                valueType="ORGANISATION_UNIT"
                name={`${namespace}.defaultOrgUnit`}
            />
        </div>
    )
}
