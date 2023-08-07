import { Option, OptionSet } from '../../../../../../../shared/types/dhis2'
import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { uid } from '@hisptz/dhis2-utils'
import { useConfiguration } from '../../../../../../../shared/hooks/config'

const optionMutate: any = {
    type: 'create',
    resource: 'metadata',
    data: ({ data }: { data: Option }) => data,
    params: {
        importStrategy: 'CREATE_AND_UPDATE',
        importMode: 'COMMIT'
    }
}

export function useManageOptions (optionSet: OptionSet, onComplete: () => void, defaultValue?: Partial<Option> | null) {
    const { config } = useConfiguration()
    const { show } = useAlert(({ message }) => message, ({ type }) => ({
        ...type,
        duration: 3000
    }))
    const [upload, {
        loading,
    }] = useDataMutation(optionMutate, {
        onError: (error) => {
            show({
                message: `${i18n.t('Could not update option')}: ${error.message}`,
                type: { critical: true }
            })
        },
        onComplete: () => {
            show({
                message: i18n.t('Option updated successfully'),
                type: { success: true }
            })
            onComplete()
        }
    })

    const onSave = async (data: Partial<Option>) => {
        if (defaultValue) {
            const payload = {
                options: [
                    {
                        ...defaultValue,
                        ...data
                    }
                ]
            }
            return await upload({
                data: payload
            })
        } else {

            const newOption = {
                ...data,
                code: `${config?.code} - ${data.code}`,
                optionSet: {
                    id: optionSet.id
                },
                sortOrder: optionSet.options.length + 1,
                id: uid()
            }
            const payload = {
                options: [
                    newOption
                ],
                optionSets: [
                    {
                        ...optionSet,
                        options: [
                            ...optionSet.options,
                            newOption
                        ]
                    }
                ]
            }
            return await upload({
                data: payload
            })
        }
    }

    return {
        onSave,
        saving: loading,
    }

}
