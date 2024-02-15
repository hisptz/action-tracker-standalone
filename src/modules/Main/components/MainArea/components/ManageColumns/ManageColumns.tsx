import {Button, IconLayoutColumns24} from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import React from "react";
import {useBoolean} from "usehooks-ts";
import {ManageColumnsModal} from "./components/ManageColumnsModal";
import {useConfiguration} from "../../../../../../shared/hooks/config";
import {useSetColumnState} from "../DataArea/components/DataCard/hooks/columns";


export function ManageColumns() {
    useSetColumnState();
    const {config} = useConfiguration();
    const {value: hide, setTrue: onHide, setFalse: onShow} = useBoolean(true);

    if (!config) {

        return null;
    }

    return (
        <>
            {
                !hide && (<ManageColumnsModal onClose={onHide} hide={hide}/>)
            }
            <Button onClick={onShow} icon={<IconLayoutColumns24/>}>{i18n.t("Manage columns")}</Button>
        </>
    )
}
