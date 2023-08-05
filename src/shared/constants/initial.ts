import { DataElement, Option, OptionSet, Sharing, TrackedEntityAttribute } from '../types/dhis2'
import { uid } from '@hisptz/dhis2-utils'
import i18n from '@dhis2/d2-i18n'
import valueType = DataElement.valueType
import aggregationType = TrackedEntityAttribute.aggregationType
import domainType = DataElement.domainType

const generateDefaultSharing = (owner: string): Sharing => ({
    external: false,
    users: {},
    userGroups: {},
    public: 'rwrw----',
    owner
})
const generateDefaultStatusOptions = (optionSetId: string, code: string): Partial<Option>[] => ([
    {
        code: `${code} - Not started`,
        name: i18n.t('Not started'),
        id: uid(),
        sortOrder: 1,
        optionSet: { id: optionSetId } as OptionSet,
        style: {
            color: '#4a90e2',
            icon: 'alert_positive'
        },
        attributeValues: [],
        translations: []
    },
    {
        code: `${code} - In progress`,
        name: i18n.t('In progress'),
        id: uid(),
        sortOrder: 2,
        optionSet: { id: optionSetId } as OptionSet,
        style: {
            color: '#f5a623',
            icon: 'high_level_positive'
        },
        attributeValues: [],
        translations: []
    },
    {
        code: `${code} - Completed`,
        name: i18n.t('Completed'),
        id: uid(),
        sortOrder: 3,
        optionSet: { id: optionSetId } as OptionSet,
        style: {
            color: '#7ed321',
            icon: 'yes_positive'
        },
        attributeValues: [],
        translations: []
    },
    {
        code: `${code} - Cancelled`,
        name: i18n.t('Cancelled'),
        id: uid(),
        sortOrder: 4,
        optionSet: { id: optionSetId } as OptionSet,
        style: {
            color: '#d0021b',
            icon: 'no_outline'
        },
        attributeValues: [],
        translations: []
    }

])
export const generateDefaultStatusOptionSetMetadata = (optionSetId: string, code: string): {
    optionSets: Array<Partial<OptionSet>>,
    options: Partial<Option>[]
} => {
    const options = generateDefaultStatusOptions(optionSetId, code)

    const optionSet = {
        id: optionSetId,
        name: `${code} - Status`,
        valueType: valueType.TEXT,
        options: options.map(({ id }) => ({ id })) as Option[]
    } satisfies Partial<OptionSet>

    return {
        optionSets: [optionSet],
        options
    }
}
const generateLinkageDataElement = (): Partial<DataElement> => ({
    id: 'kBkyDytdOmC',
    name: '[SAT] Linkage',
    valueType: valueType.TEXT,
    domainType: domainType.TRACKER,
    shortName: '[SAT] Linkage - Data Element',
    aggregationType: aggregationType.NONE,
    code: '[SAT] Linkage',
    formName: 'Linkage'
})
const generateLinkageTrackedEntityAttribute = (): Partial<TrackedEntityAttribute> => ({
    id: 'Hi3IjyMXzeW',
    name: '[SAT] Linkage',
    valueType: valueType.TEXT,
    shortName: '[SAT] Linkage - Attribute',
    aggregationType: aggregationType.NONE,
    code: '[SAT] Linkage',
    formName: 'Linkage'
})
