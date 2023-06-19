import {Button, IconLayoutColumns24} from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import React from "react";


export function ManageColumns() {

    return (
        <Button icon={<IconLayoutColumns24/>}>{i18n.t("Manage columns")}</Button>
    )
}
