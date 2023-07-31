import { useConfiguration } from "./config";
import { useAlert, useDataMutation } from "@dhis2/app-runtime";
import { useLog } from "./log";
import { type Config } from "../schemas/config";
import { initialMetadata } from "../constants/defaults";
import { generateMetadataFromConfig } from "../utils/metadata";
import { useRecoilValue } from "recoil";
import { MetadataState } from "../state/config";

export function useMetadata () {
    const { id } = useConfiguration();
    const metadata = useRecoilValue(MetadataState(id));

    if (!metadata) {
        return {};
    }

    return {
        programs: metadata.programs
    };
}

export const metadataMutation: any = {
    resource: "metadata",
    type: "create",
    data: ({ metadata }: any) => metadata,
    params: ({ mode }: any) => ({
        importStrategy: "CREATE_AND_UPDATE",
        atomicMode: "ALL",
        importMode: mode
    })
};

export function useUpdateMetadata () {
    const log = useLog();
    const { show } = useAlert(({ message }) => message, ({ type }) => ({
        ...type,
        duration: 3000
    }));
    const [sendMetadata, {
        loading: uploadingMetadata,
        error: metadataError
    }] = useDataMutation(metadataMutation, {
        onError: (error) => {
            show({
                message: `Error setting up required metadata: ${error.message}`,
                type: { critical: true }
            });
            log.error({
                message: `Error setting up required metadata: ${error.message}`,
                details: error.details,
                stack: error.stack
            });
        }
    });

    const uploadMetadata = async (metadata: any) => {
        const response = await sendMetadata({
            metadata,
            mode: "VALIDATE"
        });
        if (response === undefined) {
            return metadataError;
        }
        return await sendMetadata({
            metadata,
            mode: "COMMIT"
        });
    };

    const updateMetadataFromConfig = async (config: Config) => {
        const metadata = { ...initialMetadata, ...generateMetadataFromConfig(config, { meta: initialMetadata }) };
        return await uploadMetadata(metadata);
    };

    return {
        updateMetadataFromConfig,
        uploadMetadata,
        uploadingMetadata,
        metadataError
    };
}
