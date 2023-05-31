import React, {useEffect} from "react"
import i18n from '@dhis2/d2-i18n'
import {useNavigate} from "react-router-dom"
import {CircularLoader} from "@dhis2/ui"
import {generateBasicTemplate, initialMetadata} from "../../shared/constants/defaults";
import {generateMetadataFromConfig} from "../../shared/utils/metadata";
import config from "../../d2.config.js"
import {useDataMutation} from "@dhis2/app-runtime";
import {logger} from "../../shared/utils/logging";

const defaultConfig = generateBasicTemplate({orgUnitLevel: "1"});
const metadata = generateMetadataFromConfig(defaultConfig, {meta: initialMetadata});

const configMutation: any = {
    resource: `dataStore/${config.dataStoreNamespace}/${defaultConfig.id}`,
    type: "create",
    data: defaultConfig
}

const metadataMutation: any = {
    resource: `metadata`,
    type: "create",
    data: metadata
}

export function Welcome() {
    const navigate = useNavigate();
    const [sendConfig, {loading: uploadingConfig}] = useDataMutation(configMutation, {
        onError: (error) => {
            logger.error(`${error.message}`, {
                error: error,
            })
        }
    });
    const [sendMetadata, {loading: uploadingMetadata}] = useDataMutation(metadataMutation, {
        onError: (error) => {
            logger.error(`${error.message}`, {
                error: error,
            })
        }
    });

    useEffect(() => {
        async function setup() {
            await sendConfig();
            await sendMetadata();
            navigate("/");
        }
    }, [])

    return (
        <div className="w-100 h-100 column center align-center">
            <h1>{i18n.t("Welcome to the standalone action tracker")}</h1>
            {
                uploadingMetadata || uploadingConfig ? (<CircularLoader/>) : null
            }
            {
                uploadingConfig && (<h3>{i18n.t("Setting up default configuration...")}</h3>)
            }
            {
                uploadingMetadata && (<h3>{i18n.t("Setting up required metadata...")}</h3>)
            }
        </div>
    )
}
