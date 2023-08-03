import { type Config } from '../schemas/config'
import { PeriodTypeEnum, type TrackedEntityType, uid } from '@hisptz/dhis2-utils'
import i18n from '@dhis2/d2-i18n'

export enum EntityTypes {
    CATEGORIZATION = 'Categorization',
    ACTION = 'Action'
}

export enum EntityTypesIds {
    CATEGORIZATION = 'jLaBp1GaZQ9',
    ACTION = 'TFYpX5EXmYp'
}

export const SUPPORTED_FIELD_TYPES = [
    'TEXT',
    'LONG_TEXT',
    'NUMBER',
    'INTEGER',
    'FILE_RESOURCE',
    'DATE'
]

export interface InitialMetadata {
    trackedEntityTypes: TrackedEntityType[]
}

export const initialMetadata: InitialMetadata = {
    trackedEntityTypes: [
        {
            id: 'jLaBp1GaZQ9',
            name: `[SAT] ${EntityTypes.CATEGORIZATION}`,
            publicAccess: 'rw------'
        },
        {
            id: 'TFYpX5EXmYp',
            name: `[SAT] ${EntityTypes.ACTION}`,
            publicAccess: 'rw------'
        }
    ]
}

export function generateBasicTemplate ({ orgUnitLevel }: {
    orgUnitLevel: string
}): Config {
    const categoryId = uid()
    const actionId = uid()
    const categoryToActivityId = uid()
    const statusFieldId = uid()
    return {
        id: uid(),
        name: i18n.t('Basic Activity Template'),
        general: {
            orgUnit: {
                planning: orgUnitLevel
            },
            period: {
                planning: PeriodTypeEnum.MONTHLY,
                tracking: PeriodTypeEnum.DAILY
            }
        },
        categories: [
            {
                id: categoryId,
                name: i18n.t('Category'),
                child: {
                    id: categoryToActivityId,
                    to: actionId,
                    type: 'programStage'
                },
                fields: [
                    {
                        name: i18n.t('Title'),
                        id: uid(),
                        type: 'TEXT',
                        mandatory: true,
                        header: true
                    },
                    {
                        name: i18n.t('About'),
                        id: uid(),
                        type: 'LONG_TEXT',
                        mandatory: false
                    }
                ]
            }
        ],
        action: {
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
                    name: i18n.t('Name'),
                    type: 'TEXT',
                    mandatory: true,
                    id: uid()
                },
                {
                    name: i18n.t('Description'),
                    type: 'LONG_TEXT',
                    mandatory: true,
                    id: uid()
                },
                {
                    name: i18n.t('Start Date'),
                    type: 'DATE',
                    mandatory: true,
                    id: uid()
                },
                {
                    name: i18n.t('End Date'),
                    type: 'DATE',
                    mandatory: true,
                    id: uid()
                }
            ],
            statusConfig: {
                name: 'Status',
                id: uid(),
                stateConfig: {
                    dataElement: statusFieldId
                },
                dateConfig: {
                    name: i18n.t('Review Date')
                },
                fields: [
                    {
                        name: 'Status',
                        type: 'TEXT',
                        mandatory: true,
                        id: statusFieldId,
                        native: true
                    }
                ]
            }
        }
    }
}

export function generateLegacyTemplate (): Config {
    const bottleneckToGap = uid()
    const gapToSolution = uid()
    const solutionToAction = uid()

    return {
        id: uid(),
        name: i18n.t('Legacy  Activity Template'),
        general: {
            orgUnit: {
                planning: '1'
            },
            period: {
                planning: PeriodTypeEnum.YEARLY,
                tracking: PeriodTypeEnum.QUARTERLY
            }
        },
        categories: [
            {
                id: 'Uvz0nfKVMQJ',
                name: i18n.t('Bottleneck'),
                fields: [
                    {
                        name: i18n.t('Intervention'),
                        id: 'jZ6WL4NQtp5',
                        type: 'TEXT',
                        header: true
                    },
                    {
                        name: i18n.t('Bottleneck'),
                        id: 'WLFrBgfl7lU',
                        type: 'TEXT'
                    },
                    {
                        name: i18n.t('Coverage Indicator'),
                        id: 'imiLbaQKYnA',
                        type: 'TEXT'
                    },
                    {
                        name: i18n.t('Indicator'),
                        id: 'tVlKbtVfNjc',
                        type: 'TEXT'
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
                name: i18n.t('Gap'),
                fields: [
                    {
                        id: 'JbMaVyglSit',
                        name: i18n.t('Title'),
                        mandatory: true,
                        type: 'TEXT',
                        showAsColumn: true
                    },
                    {
                        id: 'GsbZkewUna5',
                        name: i18n.t('Description'),
                        mandatory: true,
                        type: 'TEXT'
                    },
                    {
                        id: 'W50aguV39tU',
                        name: i18n.t('Method'),
                        mandatory: true,
                        type: 'TEXT'
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
                id: 'JJaKjcOBapi',
                name: i18n.t('Possible Solutions'),
                fields: [
                    {
                        id: 'upT2cOT6UfJ',
                        name: i18n.t('Solution'),
                        mandatory: true,
                        type: 'LONG_TEXT',
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
            id: 'unD7wro3qPm',
            name: i18n.t('Action'),
            fields: [
                {
                    id: 'HQxzVwKedKu',
                    name: i18n.t('Title'),
                    type: 'TEXT',
                    showAsColumn: true,
                    native: true
                },
                {
                    id: 'GlvCtGIytIz',
                    name: i18n.t('Description'),
                    type: 'LONG_TEXT'
                },
                {
                    id: 'jFjnkx49Lg3',
                    name: i18n.t('Start Date'),
                    type: 'DATE',
                    showAsColumn: true,
                    native: true

                },
                {
                    id: 'BYCbHJ46BOr',
                    name: i18n.t('End Date'),
                    type: 'DATE',
                    showAsColumn: true,
                    native: true
                },
                {
                    id: 'G3aWsZW2MpV',
                    name: i18n.t('Responsible Person'),
                    type: 'TEXT',
                    showAsColumn: true
                },
                {
                    id: 'Ax6bWbKn46e',
                    name: i18n.t('Designation'),
                    type: 'TEXT'
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
                    dataElement: 'f8JYVWLC7rE'
                },
                dateConfig: {
                    name: i18n.t('Review Date')
                },
                name: i18n.t('Action Status'),
                fields: [
                    {
                        name: i18n.t('Action Status'),
                        type: 'TEXT',
                        id: 'f8JYVWLC7rE',
                        native: true
                    },
                    {
                        name: i18n.t('Remarks / Comment'),
                        type: 'LONG_TEXT',
                        id: 'FnengvwgsQv'
                    }
                ],
                id: 'cBiAEANcXAj'
            }

        }
    }
}
