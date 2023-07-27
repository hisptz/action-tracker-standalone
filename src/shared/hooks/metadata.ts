import { useConfiguration } from './config'
import { useMemo } from 'react'
import { head, isEmpty } from 'lodash'
import { useAlert, useDataMutation, useDataQuery } from '@dhis2/app-runtime'
import { type Program } from '@hisptz/dhis2-utils'
import { useLog } from './log'
import { type Config } from '../schemas/config'
import { initialMetadata } from '../constants/defaults'
import { generateMetadataFromConfig } from '../utils/metadata'

const programQuery: any = {
    programs: {
        resource: "programs",
        params: ({ids}: { ids: string [] }) => (
            {
                filter: [
                    `id:in:[${ids.join(',')}]`
                ],
                fields: [
                    'id',
                    'displayName',
                    'trackedEntityType',
                    'programTrackedEntityAttributes[mandatory,trackedEntityAttribute[id,displayName,valueType,shortName,formName,optionSet[id,options[code,name]]]]',
                    'programStages[id,displayName,program[id],programStageDataElements[mandatory,dataElement[id,displayName,shortName,valueType,formName,optionSet[id,options[code,name]]]]]'
                ]
            }
        )
    }
}

export function useMetadata() {
    const {config} = useConfiguration();
    const programs = useMemo(() => {
        if (config == null) return;
        const categoryProgram = head(config?.categories)?.id;
        const actionProgram = config?.action.id;

        return [
            categoryProgram,
            actionProgram
        ]
    }, [config])
    const {data, loading} = useDataQuery<{ programs: { programs: Program[] } }>(programQuery, {
        variables: {
            ids: programs
        },
        lazy: isEmpty(programs)
    });

    return {
        loading,
        programs: data?.programs?.programs
    }
}

export const metadataMutation: any = {
    resource: `metadata`,
    type: "create",
    data: ({metadata}: any) => metadata,
    params: ({ mode }: any) => ({
        importStrategy: "CREATE_AND_UPDATE",
        atomicMode: 'ALL',
        importMode: mode
    })
}
export function useUpdateMetadata() {
    const log = useLog();
    const {show} = useAlert(({message}) => message, ({type}) => ({...type, duration: 3000}));
    const [sendMetadata, {loading: uploadingMetadata, error: metadataError}] = useDataMutation(metadataMutation, {
        onError: (error) => {
            show({message: `Error setting up required metadata: ${error.message}`, type: {critical: true}});
            log.error({
                message: `Error setting up required metadata: ${error.message}`,
                details: error.details,
                stack: error.stack
            })
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
    }

    const updateMetadataFromConfig = async (config: Config) => {
        const metadata = {...initialMetadata, ...generateMetadataFromConfig(config, {meta: initialMetadata})};
        return await uploadMetadata(metadata);
    }

    return {
        updateMetadataFromConfig,
        uploadMetadata,
        uploadingMetadata,
        metadataError
    }
}
