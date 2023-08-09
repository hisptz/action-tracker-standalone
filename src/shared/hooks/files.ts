import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'

const fileUploadMutation: any = {
    resource: 'fileResources',
    type: 'create',
    data: (data: { file: File }) => data
}

export function useUploadFile () {
    const {
        show,
        hide
    } = useAlert(({ message }) => message, ({ type }) => ({
        ...type,
        duration: 3000
    }))
    const [mutate, {
        loading: uploading,
        error
    }] = useDataMutation(fileUploadMutation, {
        onError: (error) => {
            show({
                message: i18n.t('Could not upload file {{ errorMessage }}', {
                    errorMessage: error.message
                }),
                type: { critical: true }
            })
            setTimeout(hide, 5000)
        }
    })

    const uploadFile = async (data: { file: File }): Promise<string | undefined> => {
        const uploadResponse = await mutate(data) as any
        return uploadResponse?.response?.fileResource?.id
    }

    return {
        uploading,
        uploadFile,
        error
    }
}

