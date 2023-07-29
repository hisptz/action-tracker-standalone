import { DataElement, Option, OptionSet, Sharing, TrackedEntityAttribute } from '../types/types'
import { uid } from '@hisptz/dhis2-utils'
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
const generateDefaultStatusOptions = (optionSet: OptionSet): Partial<Option>[] => ([
    {
        code: 'Cancelled',
        created: '2021-04-22T12:50:22.498',
        lastUpdated: '2021-04-22T12:50:22.585',
        name: 'Cancelled',
        id: 'FEz7OK0NVRW',
        sortOrder: 6,
        optionSet: optionSet,
        style: {
            color: '#d0021b',
            icon: 'no_outline'
        },
        attributeValues: [],
        translations: []
    },
    {
        code: 'Completed',
        created: '2021-04-22T13:06:06.292',
        lastUpdated: '2021-04-22T13:06:06.325',
        name: 'Completed',
        id: 'JzKswnTlxSn',
        sortOrder: 5,
        optionSet: optionSet,
        style: {
            color: '#7ed321',
            icon: 'yes_positive'
        },
        attributeValues: [],
        translations: []
    },
    {
        code: ' In progress',
        created: '2021-04-22T13:07:26.200',
        lastUpdated: '2021-04-22T13:07:26.241',
        name: 'In progress',
        id: 'CI07xeRxsZU',
        sortOrder: 4,
        optionSet: optionSet,
        style: {
            color: '#f5a623',
            icon: 'high_level_positive'
        },
        attributeValues: [],
        translations: []
    },
    {
        code: 'Not started',
        created: '2021-04-22T13:08:26.117',
        lastUpdated: '2021-04-22T13:08:26.148',
        name: 'Not started',
        id: 'fLUmGT0p0Sh',
        sortOrder: 3,
        optionSet: optionSet,
        style: {
            color: '#4a90e2',
            icon: 'alert_positive'
        },
        attributeValues: [],
        translations: []
    }
])
const generateDefaultStatusOptionSet = (name: string): OptionSet => <OptionSet>({
    name,
    id: uid(),
    valueType: valueType.TEXT
})
const generateLinkageDataElement = (): Partial<DataElement> => ({
    id: uid(),
    name: '[SAT] Linkage',
    valueType: valueType.TEXT,
    domainType: domainType.TRACKER
})
const generateLinkageTrackedEntityAttribute = (): Partial<TrackedEntityAttribute> => ({
    id: uid(),
    name: '[SAT] Linkage',
    valueType: valueType.TEXT,
    shortName: '[SAT] Linkage',
    aggregationType: aggregationType.NONE,
    code: '[SAT] Linkage',
    formName: 'Linkage'
})
