import React, {useEffect} from "react"
import i18n from '@dhis2/d2-i18n'
import {useNavigate} from "react-router-dom"
import {CircularLoader} from "@dhis2/ui"
import {generateBasicTemplate, initialMetadata} from "../../shared/constants/defaults";
import {generateMetadataFromConfig} from "../../shared/utils/metadata";
import {useAlert, useDataMutation} from "@dhis2/app-runtime";
import {DATASTORE_NAMESPACE} from "../../shared/constants/meta";
import {useLog} from "../../shared/hooks";
import {useConfigurations} from "../../shared/hooks/config";
import {isEmpty} from "lodash";

const defaultConfig = generateBasicTemplate({orgUnitLevel: "1"});
const metadata = {...initialMetadata, ...generateMetadataFromConfig(defaultConfig, {meta: initialMetadata})};

const configMutation: any = {
    resource: `dataStore/${DATASTORE_NAMESPACE}/${defaultConfig.id}`,
    type: "create",
    data: ({data}: any) => data
}
export const metadataMutation: any = {
    resource: `metadata`,
    type: "create",
    data: ({metadata}: any) => metadata,
    params: {
        importStrategy: "CREATE_AND_UPDATE",
        atomicMode: 'ALL',
    }
}

export function Welcome() {
    const navigate = useNavigate();
    const {configs} = useConfigurations()
    const log = useLog();
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}));
    const [sendConfig, {loading: uploadingConfig, error: configError}] = useDataMutation(configMutation, {
        onError: (error) => {
            show({message: `Error setting up default configuration: ${error.message}`, type: {critical: true}});
            log.error({
                message: `Error setting up default configuration: ${error.message}`,
                details: error.details,
                stack: error.stack
            });
        }
    });
    const [sendMetadata, {loading: uploadingMetadata, error: metadataError}] = useDataMutation(metadataMutation, {
        onError: (error) => {
            show({message: `Error setting up required metadata: ${error.message}`, type: {critical: true}});
            log.error({
                message: `Error setting up required metadata: ${error.message}`,
                details: error.details,
                stack: error.stack,
            })
        }
    });

    useEffect(() => {
        async function setup() {
            await sendConfig({
                data: defaultConfig
            });
            await sendMetadata({
                metadata
            });
            navigate("/", {replace: true});
        }

        if (!configs || isEmpty(configs)) {
            setup();
        } else {
            navigate("/", {replace: true});
        }
    }, [])


    if (configError || metadataError) {
        return (
            <div className="w-100 h-100 column center align-center">
                <h1>{i18n.t("Error setting up default configuration")}</h1>
                <p>{i18n.t("Please take a look at the logs for more details")}</p>
            </div>
        )
    }

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
