import { Option, OptionSet } from '../../../../../../../shared/types/dhis2'
import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { uid } from '@hisptz/dhis2-utils'
import { useConfiguration } from '../../../../../../../shared/hooks/config'

const optionMutate: any = {
    type: 'create',
    resource: 'metadata',
    data: ({ data }: { data: Option }) => data,
    params: ({ strategy }: { strategy?: string }) => ({
        importStrategy: strategy ?? 'CREATE_AND_UPDATE',
        importMode: 'COMMIT'
    })
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
            await upload({
                data: payload
            })
            show({
                message: i18n.t('Option updated successfully'),
                type: { success: true }
            })
            onComplete()

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
            await upload({
                data: payload
            })
            show({
                message: i18n.t('Option added successfully'),
                type: { success: true }
            })
            onComplete()

        }
    }

    const onDelete = async (id: string) => {
        const payload = {
            options: [
                {
                    id
                }
            ]
        }
        await upload({
            data: payload,
            strategy: 'DELETE'
        })
        show({
            message: i18n.t('Option deleted successfully'),
            type: { success: true }
        })
        onComplete()

    }

    return {
        onSave,
        onDelete,
        saving: loading,
    }

}
