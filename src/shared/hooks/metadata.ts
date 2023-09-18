import { useConfiguration } from './config'
import { useAlert, useDataEngine } from '@dhis2/app-runtime'
import { useLog } from './log'
import { type Config } from '../schemas/config'
import { initialMetadata } from '../constants/defaults'
import { generateMetadataFromConfig } from '../utils/metadata'
import { useRecoilValue } from 'recoil'
import { MetadataState } from '../state/config'
import { useMutation } from '@tanstack/react-query'

export function useMetadata () {
    const { id } = useConfiguration()
    const meta = useRecoilValue(MetadataState(id))

    const {
        programs,
        status
    } = meta ?? {}

    if (!programs) {
        return {}
    }

    return {
        programs: programs?.programs,
        status
    }
}

export const metadataMutation: any = {
    resource: 'metadata',
    type: 'create',
    data: ({ metadata, }: any) => metadata,
    params: ({
                 mode,
                 importStrategy,
                 atomicMode
             }: any) => ({
        importStrategy: importStrategy ?? 'CREATE_AND_UPDATE',
        atomicMode: atomicMode ?? 'ALL',
        importMode: mode,
        reportMode: 'FULL'
    })
}

export function useUpdateMetadata () {
    const log = useLog()
    const engine = useDataEngine()
    const { show } = useAlert(({ message }) => message, ({ type }) => ({
        ...type,
        duration: 3000
    }))

    const send = async (options: { mode: string; metadata: any, importStrategy?: string; atomicMode?: string }) => {
        return engine.mutate(metadataMutation, {
            variables: options
        })
    }
    const {
        mutateAsync: sendMetadata,
        isLoading: uploadingMetadata,
        error: metadataError
    } = useMutation(['metadata'], send)

    const uploadMetadata = async (metadata: any) => {
        //If there are any errors expect this to throw them
        await sendMetadata({
            metadata,
            mode: 'VALIDATE'
        })
        return sendMetadata({
            metadata,
            mode: 'COMMIT'
        })
    }

    const deleteMetadata = async (metadata: any) => {
        //If there are any errors expect this to throw them
        await sendMetadata({
            metadata,
            mode: 'VALIDATE',
            importStrategy: 'DELETE',
            atomicMode: 'NONE'
        })
        return sendMetadata({
            metadata,
            mode: 'COMMIT',
            importStrategy: 'DELETE',
            atomicMode: 'NONE'
        })
    }

    const updateMetadataFromConfig = async (config: Config) => {
        const metadata = { ...initialMetadata, ...generateMetadataFromConfig(config, { meta: initialMetadata }) }
        return uploadMetadata(metadata)
    }

    const createMetadataFromConfig = async (config: Config, extraMetadata: Record<string, any>) => {
        const metadata = { ...(extraMetadata ?? {}), ...initialMetadata, ...generateMetadataFromConfig(config, { meta: initialMetadata }) }
        return uploadMetadata(metadata)
    }

    const deleteMetadataFromConfig = async (config: Config) => {
        const metadata = { ...generateMetadataFromConfig(config, { meta: initialMetadata }) }
        await deleteMetadata({
            programs: metadata.programs,
            programStages: metadata.programStages,
        })
        await deleteMetadata({
            dataElements: metadata.dataElements,
            trackedEntityAttributes: metadata.trackedEntityAttributes,
        })

        return deleteMetadata({
            optionSets: [
                {
                    id: config.action.statusConfig.stateConfig.optionSetId
                }
            ]
        })
    }

    return {
        updateMetadataFromConfig,
        deleteMetadataFromConfig,
        createMetadataFromConfig,
        uploadMetadata,
        uploadingMetadata,
        metadataError
    }
}
