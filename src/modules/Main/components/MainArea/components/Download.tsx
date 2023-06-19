import {DropdownButton, IconDownload24} from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import React from "react";


export function Download() {

    return (
        <DropdownButton icon={<IconDownload24/>}>{i18n.t("Download")}</DropdownButton>
    )
}
