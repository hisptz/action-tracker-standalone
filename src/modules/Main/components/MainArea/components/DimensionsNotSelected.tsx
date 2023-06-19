import React from "react";
import i18n from '@dhis2/d2-i18n';
import {colors} from "@dhis2/ui";


export function DimensionsNotSelected() {

    return (
        <div className="column center align-center h-100">
            <h1 style={{color: colors.grey700}}>{i18n.t("Select organisation unit and period to start")}</h1>
        </div>
    )
}
