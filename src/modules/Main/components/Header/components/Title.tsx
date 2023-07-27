import React, { useCallback, useMemo } from 'react'
import { colors, SegmentedControl } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { useSearchParams } from 'react-router-dom'
import { capitalize } from 'lodash'

export function Title() {
    const [params, setSearchParams] = useSearchParams();

    const handleSegmentChange = useCallback(({value}: { value: "planning" | "tracking" }) => {
        setSearchParams((prev) => {
            const updatedParams = new URLSearchParams(params);
            updatedParams.set("type", value);
            return updatedParams;
        });
    }, [setSearchParams]);

    const type = useMemo(() => params.get("type") ?? "planning", [params.get("type")])

    return (
        <div style={{justifyContent: "left"}} className="row gap-16 align-center">
            <h2 style={{color: colors.grey700}}>{i18n.t("Action {{type}}", {
                type: capitalize(type)
            })}</h2>
            <SegmentedControl
                selected={type}
                onChange={handleSegmentChange}
                options={[
                    {label: i18n.t("Planning"), value: "planning"},
                    {label: i18n.t("Tracking"), value: "tracking"}
                ]}
            />
        </div>
    )
}
