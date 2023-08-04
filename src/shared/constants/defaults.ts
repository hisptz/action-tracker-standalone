import { type Config } from '../schemas/config'
import { PeriodTypeEnum, type TrackedEntityType, uid } from '@hisptz/dhis2-utils'
import i18n from '@dhis2/d2-i18n'

import { Attribute } from '../types/dhis2'
import { DATA_ELEMENT_LINKAGE, TRACKED_ENTITY_ATTRIBUTE_LINKAGE } from '../utils/config'
import valueType = Attribute.valueType

export enum EntityTypes {
    CATEGORIZATION = 'Categorization',
    ACTION = 'Action'
}

export enum EntityTypesIds {
    CATEGORIZATION = 'jLaBp1GaZQ9',
    ACTION = 'TFYpX5EXmYp'
}

export interface InitialMetadata {
    trackedEntityTypes: TrackedEntityType[]
}

export const initialMetadata: InitialMetadata = {
    trackedEntityTypes: [
        {
            id: EntityTypesIds.CATEGORIZATION,
            name: `[SAT] ${EntityTypes.CATEGORIZATION}`,
            publicAccess: 'rw------'
        },
        {
            id: EntityTypesIds.ACTION,
            name: `[SAT] ${EntityTypes.ACTION}`,
            publicAccess: 'rw------'
        }
    ]
}

function slug (name: string) {
    return name.replaceAll(/ +/g, '-').toLowerCase()
}

export function generateBasicTemplate (): Config {
    const name = i18n.t('Basic Activity Template') as string
    const categoryId = uid()
    const actionId = uid()
    const categoryToActivityId = uid()
    const statusFieldId = uid()
    return {
        id: slug(name),
        name,
        general: {
            period: {
                planning: PeriodTypeEnum.YEARLY,
                tracking: PeriodTypeEnum.MONTHLY
            },
            orgUnit: {},
            sharing: {}
        },
        categories: [
            {
                type: 'program',
                id: categoryId,
                name: i18n.t('Category'),
                child: {
                    id: categoryToActivityId,
                    to: actionId,
                    type: 'programStage'
                },
                fields: [
                    {
                        name: i18n.t('Category'),
                        shortName: 'Category',
                        id: uid(),
                        type: valueType.TEXT,
                        mandatory: true,
                        header: true
                    },
                    {
                        name: i18n.t('About'),
                        shortName: 'About',
                        id: uid(),
                        type: valueType.LONG_TEXT,
                        mandatory: false
                    }
                ]
            }
        ],
        action: {
            type: 'program',
            id: uid(),
            name: i18n.t('Activity'),
            parent: {
                from: categoryId,
                id: uid(),
                type: 'program',
                name: i18n.t('Category')
            },
            fields: [
                {
                    name: i18n.t('Activity'),
                    shortName: 'Activity',
                    type: valueType.TEXT,
                    mandatory: true,
                    id: uid()
                },
                {
                    name: i18n.t('Description'),
                    type: valueType.LONG_TEXT,
                    mandatory: true,
                    id: uid(),
                    shortName: 'Description'
                },
                {
                    name: i18n.t('Start Date'),
                    shortName: 'Start Date',
                    type: valueType.DATE,
                    mandatory: true,
                    id: uid()
                },
                {
                    name: i18n.t('End Date'),
                    type: valueType.DATE,
                    shortName: 'End Date',
                    mandatory: true,
                    id: uid()
                }
            ],
            statusConfig: {
                name: 'Status',
                id: uid(),
                stateConfig: {
                    dataElement: statusFieldId,
                    optionSetId: ''
                },
                dateConfig: {
                    name: i18n.t('Review Date')
                },
                fields: [
                    {
                        name: i18n.t('Status'),
                        type: valueType.TEXT,
                        shortName: 'Status',
                        mandatory: true,
                        id: statusFieldId,
                        native: true
                    }
                ]
            }
        },
        meta: {
            linkageConfig: {
                trackedEntityAttribute: TRACKED_ENTITY_ATTRIBUTE_LINKAGE,
                dataElement: DATA_ELEMENT_LINKAGE
            }
        }
    }
}

export function generateLegacyTemplate (): Config {
    const name = i18n.t('Bottleneck Analysis Structure')
    const bottleneckToGap = uid()
    const gapToSolution = uid()
    const solutionToAction = uid()

    return {
        id: slug(name),
        name,
        general: {
            orgUnit: {},
            period: {
                planning: PeriodTypeEnum.YEARLY,
                tracking: PeriodTypeEnum.QUARTERLY
            },
            sharing: {}
        },
        categories: [
            {
                type: 'program',
                id: 'Uvz0nfKVMQJ',
                name: i18n.t('Bottleneck'),
                fields: [
                    {
                        name: i18n.t('Intervention'),
                        shortName: 'Intervention',
                        id: 'jZ6WL4NQtp5',
                        type: valueType.TEXT,
                        header: true
                    },
                    {
                        name: i18n.t('Bottleneck'),
                        shortName: 'Bottleneck',
                        id: 'WLFrBgfl7lU',
                        type: valueType.TEXT
                    },
                    {
                        name: i18n.t('Coverage Indicator'),
                        shortName: 'Coverage Indicator',
                        id: 'imiLbaQKYnA',
                        type: valueType.TEXT
                    },
                    {
                        name: i18n.t('Indicator'),
                        shortName: 'Indicator',
                        id: 'tVlKbtVfNjc',
                        type: valueType.TEXT
                    }
                ],
                child: {
                    to: 'zXB8tWKuwcl',
                    type: 'programStage',
                    id: bottleneckToGap
                }
            },
            {
                id: 'zXB8tWKuwcl',
                type: 'programStage',
                name: i18n.t('Gap'),
                fields: [
                    {
                        id: 'JbMaVyglSit',
                        name: i18n.t('Gap'),
                        mandatory: true,
                        type: valueType.TEXT,
                        showAsColumn: true,
                        shortName: 'Gap'
                    },
                    {
                        id: 'GsbZkewUna5',
                        name: i18n.t('Description'),
                        mandatory: true,
                        type: valueType.TEXT,
                        shortName: 'Description'
                    },
                    {
                        id: 'W50aguV39tU',
                        name: i18n.t('Method'),
                        mandatory: true,
                        type: valueType.TEXT,
                        shortName: 'Method'
                    }

                ],
                parent: {
                    name: 'Bottleneck to Gap',
                    from: 'Uvz0nfKVMQJ',
                    type: 'program',
                    id: bottleneckToGap
                },
                child: {
                    to: 'JJaKjcOBapi',
                    type: 'programStage',
                    id: gapToSolution
                }
            },
            {
                type: 'programStage',
                id: 'JJaKjcOBapi',
                name: i18n.t('Possible Solutions'),
                fields: [
                    {
                        id: 'upT2cOT6UfJ',
                        name: i18n.t('Solution'),
                        shortName: 'Solution',
                        mandatory: true,
                        type: valueType.LONG_TEXT,
                        showAsColumn: true
                    }
                ],
                parent: {
                    name: 'Gap to Solution',
                    from: 'zXB8tWKuwcl',
                    type: 'programStage',
                    id: gapToSolution
                },
                child: {
                    to: 'unD7wro3qPm',
                    type: 'program',
                    id: solutionToAction
                }
            }
        ],
        action: {
            type: 'program',
            id: 'unD7wro3qPm',
            name: i18n.t('Action'),
            fields: [
                {
                    id: 'HQxzVwKedKu',
                    name: i18n.t('Title'),
                    shortName: 'Title',
                    type: valueType.TEXT,
                    showAsColumn: true,
                    native: true
                },
                {
                    id: 'GlvCtGIytIz',
                    name: i18n.t('Description'),
                    type: valueType.LONG_TEXT,
                    shortName: 'Description'
                },
                {
                    id: 'jFjnkx49Lg3',
                    name: i18n.t('Start Date'),
                    type: valueType.DATE,
                    showAsColumn: true,
                    native: true,
                    shortName: 'Start Date'

                },
                {
                    id: 'BYCbHJ46BOr',
                    name: i18n.t('End Date'),
                    type: valueType.DATE,
                    showAsColumn: true,
                    native: true,
                    shortName: 'End Date'
                },
                {
                    id: 'G3aWsZW2MpV',
                    name: i18n.t('Responsible Person'),
                    type: valueType.TEXT,
                    showAsColumn: true,
                    shortName: 'Responsible Person'
                },
                {
                    id: 'Ax6bWbKn46e',
                    name: i18n.t('Designation'),
                    type: valueType.TEXT,
                    shortName: 'Designation'
                }
            ],
            parent: {
                from: 'JJaKjcOBapi',
                type: 'programStage',
                name: 'Solution to Action',
                id: solutionToAction
            },
            statusConfig: {
                stateConfig: {
                    dataElement: 'f8JYVWLC7rE',
                    optionSetId: ''
                },
                dateConfig: {
                    name: i18n.t('Review Date')
                },
                name: i18n.t('Action Status'),
                fields: [
                    {
                        name: i18n.t('Action Status'),
                        shortName: 'Action status',
                        type: valueType.TEXT,
                        id: 'f8JYVWLC7rE',
                        native: true
                    },
                    {
                        name: i18n.t('Remarks / Comment'),
                        type: valueType.LONG_TEXT,
                        id: 'FnengvwgsQv',
                        shortName: 'Remarks / Comment'
                    }
                ],
                id: 'cBiAEANcXAj'
            }

        },
        meta: {
            linkageConfig: {
                dataElement: DATA_ELEMENT_LINKAGE,
                trackedEntityAttribute: TRACKED_ENTITY_ATTRIBUTE_LINKAGE
            }
        }
    }
}
