import { CategoryConfig, type Config } from '../schemas/config'
import { PeriodTypeEnum, type TrackedEntityType, uid } from '@hisptz/dhis2-utils'
import i18n from '@dhis2/d2-i18n'

import { Attribute } from '../types/dhis2'
import { DATA_ELEMENT_LINKAGE, TRACKED_ENTITY_ATTRIBUTE_LINKAGE } from '../utils/config'
import { last, reduce } from 'lodash'
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

function generateCategories (count: number, { activityLinkageId }: { activityLinkageId: string }): CategoryConfig[] {
    const levels = Array.from(Array(count).keys()).map((level) => level + 1)
    const categories = levels.map((level, index) => {
        const id = uid()
        return {
            type: index === 0 ? 'program' : 'programStage',
            id: id,
            name: `${i18n.t('Category')} level ${level}`,
            fields: [
                {
                    name: i18n.t('Category level {{level}}', { level }),
                    shortName: `Category level ${level}`,
                    id: uid(),
                    type: valueType.TEXT,
                    mandatory: true,
                    header: true
                }
            ]
        } as CategoryConfig
    })

    return reduce(categories, (acc, category, index) => {
        if (index === 0) {
            acc.push({
                ...category,
                child: {
                    type: 'programStage',
                    id: uid(),
                    to: categories[index + 1]?.id
                }
            })
            return acc
        }
        if (index === categories.length - 1) {
            const parentCategory = last(acc) as CategoryConfig
            acc.push({
                ...category,
                parent: {
                    type: index - 1 === 0 ? 'program' : 'programStage',
                    id: uid(),
                    from: parentCategory?.id,
                    name: `${parentCategory.name} to ${category.name}`
                },
                child: {
                    type: 'program',
                    id: uid(),
                    to: activityLinkageId
                }
            })
            return acc
        }
        const parentCategory = last(acc) as CategoryConfig
        const childCategory = categories[index + 1] as CategoryConfig
        acc.push({
            ...category,
            parent: {
                type: index - 1 === 0 ? 'program' : 'programStage',
                id: uid(),
                from: parentCategory?.id,
                name: `${parentCategory.name} to ${category.name}`
            },
            child: {
                type: 'programStage',
                id: uid(),
                to: childCategory?.id
            }
        })
        return acc

    }, [] as CategoryConfig[])
}

export function generateBasicTemplate (levels: number) {

    return ({
                name,
                code
            }: { name: string; code: string }): Config => {
        const categoryId = uid()
        const actionId = uid()
        const categoryToActivityId = uid()
        const statusFieldId = uid()
        const statusOptionSetId = uid()

        const categories = generateCategories(levels, { activityLinkageId: actionId })
        return {
            id: slug(name),
            code,
            name,
            general: {
                period: {
                    planning: PeriodTypeEnum.YEARLY,
                    tracking: PeriodTypeEnum.MONTHLY
                },
                orgUnit: {},
                sharing: {}
            },
            categories,
            action: {
                type: 'program',
                id: actionId,
                name: i18n.t('Activity'),
                parent: {
                    from: categoryId,
                    id: categoryToActivityId,
                    type: 'program',
                    name: i18n.t('Category')
                },
                fields: [
                    {
                        name: i18n.t('Activity'),
                        shortName: 'Activity',
                        type: valueType.TEXT,
                        mandatory: true,
                        showAsColumn: true,
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
                        showAsColumn: true,
                        mandatory: true,
                        native: true,
                        isStartDate: true,
                        id: uid()
                    },
                    {
                        name: i18n.t('End Date'),
                        type: valueType.DATE,
                        shortName: 'End Date',
                        showAsColumn: true,
                        mandatory: true,
                        native: true,
                        isEndDate: true,
                        id: uid()
                    }
                ],
                statusConfig: {
                    name: 'Status',
                    id: uid(),
                    stateConfig: {
                        dataElement: statusFieldId,
                        optionSetId: statusOptionSetId
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
                            optionSet: {
                                id: statusOptionSetId
                            },
                            native: true,
                            showAsColumn: true
                        },
                        {
                            name: i18n.t('Comments'),
                            type: valueType.LONG_TEXT,
                            id: uid(),
                            showAsColumn: true,
                            shortName: 'Comments'
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
}

export function generateLegacyTemplate ({
                                            name,
                                            code
                                        }: { name: string; code: string }): Config {
    const bottleneckToGap = uid()
    const gapToSolution = uid()
    const solutionToAction = uid()

    const statusOptionSetId = uid()

    return {
        id: slug(name),
        code,
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
                    shortName: 'Start Date',
                    isStartDate: true

                },
                {
                    id: 'BYCbHJ46BOr',
                    name: i18n.t('End Date'),
                    type: valueType.DATE,
                    showAsColumn: true,
                    native: true,
                    shortName: 'End Date',
                    isEndDate: true
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
                    optionSetId: statusOptionSetId
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
