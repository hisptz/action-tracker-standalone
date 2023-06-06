import React, {useCallback} from "react";
import {colors, SegmentedControl} from "@dhis2/ui"
import i18n from '@dhis2/d2-i18n';
import {useSearchParams} from "react-router-dom";
import {capitalize} from "lodash";

export function Title() {
    const [params, setSearchParams] = useSearchParams();


    const handleSegmentChange = useCallback(({value}: { value: "planning" | "tracking" }) => {
        const updatedParams = new URLSearchParams(params);
        updatedParams.set("type", value);
        setSearchParams(updatedParams);
    }, [])


    return (
        <div style={{justifyContent: "left"}} className="row gap-16 align-center">
            <h2 style={{color: colors.grey700}}>{i18n.t("Action {{type}}", {
                type: capitalize(params.get("type") as string)
            })}</h2>
            <SegmentedControl
                selected={params.get("type")}
                onChange={handleSegmentChange}
                options={[
                    {label: i18n.t("Planning"), value: "planning"},
                    {label: i18n.t("Tracking"), value: "tracking"},
                ]}
            />
        </div>
    )
}
