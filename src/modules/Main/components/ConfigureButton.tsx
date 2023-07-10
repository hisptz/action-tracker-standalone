import {Button, IconSettings24} from "@dhis2/ui"
import i18n from '@dhis2/d2-i18n';
import React from "react";
import {useNavigate} from "react-router-dom";


export function ConfigureButton() {
    const navigate = useNavigate()
    const onSettingsClick = () => {
        navigate('config/general')
    }

    return (
        <Button icon={<IconSettings24/>} onClick={onSettingsClick}>
            {i18n.t("Configure")}
        </Button>
    )
}
