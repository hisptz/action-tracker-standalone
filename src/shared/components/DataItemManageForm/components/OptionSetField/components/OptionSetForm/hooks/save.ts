import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import { OptionSetData } from '../OptionSetForm'
import { get, isEmpty } from 'lodash'
import i18n from '@dhis2/d2-i18n'

const metadataMutation = {
    type: 'create',
    resource: 'metadata',
    data: ({ data }: any) => data
}

export function useManageOptionSet () {
    const { show } = useAlert(({ message }) => message, ({ type }) => ({
        ...type,
        duration: 3000
    }))
    const [uploadMetadata, { loading: creatingOptions }] = useDataMutation(metadataMutation as any, {
        onError: (error) => {
            show({
                message: error.message,
                type: { info: true }
            })
        }
    })
    const saveOptionSet = async (optionSet: OptionSetData) => {
        const payload = {
            optionSets: [
                {
                    ...optionSet,
                    options: []
                },
            ],
            options: optionSet.options
        }
        const response = await uploadMetadata({ data: payload })
        if (isEmpty(get(response, ['response', 'errorReports']))) {
            show({
                message: i18n.t('Option set saved successfully'),
                type: { success: true }
            })
            return true
        } else {
            show({
                message: `${i18n.t('Error saving option set')}:  ${get(response, ['response', 'errorReports'])?.map(({ message }: {
                    message: string
                }) => message).join(', \n')}`,
                type: { info: true }
            })
            return false
        }
    }

    return {
        saveOptionSet,
        saving: creatingOptions
    }
}
