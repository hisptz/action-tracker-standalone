import React, {useEffect} from "react"
import i18n from '@dhis2/d2-i18n'
import {useNavigate} from "react-router-dom"
import {CircularLoader} from "@dhis2/ui"
import {generateBasicTemplate, initialMetadata} from "../../shared/constants/defaults";
import {generateMetadataFromConfig} from "../../shared/utils/metadata";
import {useDataMutation} from "@dhis2/app-runtime";
import {DATASTORE_NAMESPACE} from "../../shared/constants/meta";

const defaultConfig = generateBasicTemplate({orgUnitLevel: "1"});
const metadata = {...initialMetadata, ...generateMetadataFromConfig(defaultConfig, {meta: initialMetadata})};

const configMutation: any = {
    resource: `dataStore/${DATASTORE_NAMESPACE}/${defaultConfig.id}`,
    type: "create",
    data: defaultConfig
}

export const metadataMutation: any = {
    resource: `metadata`,
    type: "create",
    data: ({metadata}: any) => metadata,
    params: {
        importStrategy: "CREATE_AND_UPDATE",
        atomicMode: 'NONE',
        mergeMode: "MERGE"
    }
}

export function Welcome() {
    const navigate = useNavigate();
    const [sendConfig, {loading: uploadingConfig}] = useDataMutation(configMutation, {
        onError: (error) => {
            // logger.error(`${error.message}`, {
            //     error: error,
            // })
        }
    });
    const [sendMetadata, {loading: uploadingMetadata}] = useDataMutation(metadataMutation, {
        onError: (error) => {
            // logger.error(`${error.message}`, {
            //     error: error,
            // })
        }
    });

    useEffect(() => {
        async function setup() {
            await sendConfig();
            await sendMetadata();
            navigate("/");
        }

        setup();
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
