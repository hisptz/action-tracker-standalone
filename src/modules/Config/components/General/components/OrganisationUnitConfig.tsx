import React from 'react'
import i18n from '@dhis2/d2-i18n';
import {RHFCheckboxField, RHFSingleSelectField} from "@hisptz/dhis2-ui";
import {useWatch} from "react-hook-form";


function OrgUnitPlanning() {
    const namespace = `general.orgUnit.planning`;
    const [enabled] = useWatch({
        name: [`${namespace}.enabled`]
    });

    return (
        <>
            <RHFCheckboxField label={i18n.t("Limit planning of actions to specific organisation unit levels")}
                              name={`${namespace}.enabled`}/>
            {
                enabled && (
                    <RHFSingleSelectField
                        required
                        disabled={!enabled}
                        label={i18n.t("Planning organisation unit level")} options={[]}
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
        </div>
    )
}
