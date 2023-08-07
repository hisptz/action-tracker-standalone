import { Option, OptionSet } from '../../../../../../../shared/types/dhis2'
import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'

const optionMutate: any = {
    type: 'create',
    resource: 'metadata',
    data: ({ data }: { data: Option }) => data,
    params: {
        importStrategy: 'CREATE_AND_UPDATE',
        importMode: 'COMMIT'
    }
}

export function useManageOptions (optionSet: OptionSet, onComplete: () => void, defaultValue?: Partial<Option>) {
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
        }
    }

    return {
        onSave,
        saving: loading,
    }

}
