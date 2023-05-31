import React from "react"
import i18n from '@dhis2/d2-i18n'
import {useNavigate} from "react-router-dom"
import {Button} from "@dhis2/ui"
import {generateBasicTemplate, initialMetadata} from "../../shared/constants/defaults";
import {generateMetadataFromConfig} from "../../shared/utils/metadata";

export function Welcome() {
    const navigate = useNavigate();
    const defaultConfig = generateBasicTemplate({orgUnitLevel: "1"});
    const metadata = generateMetadataFromConfig(defaultConfig, {meta: initialMetadata});

    return (
        <div className="w-100 h-100 column center align-center">
            <h1>{i18n.t("Welcome to the standalone action tracker")}</h1>
            <Button
                primary
                onClick={() => {
                    navigate('/config')
                }}>{i18n.t("Get started")}</Button>
        </div>
    )
}
