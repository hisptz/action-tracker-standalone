import {
    ActionConfig,
    ActionStatusConfig,
    CategoryConfig,
    Config,
    DataField,
    GeneralConfig,
    SharingConfig
} from '../schemas/config'
import { Program, ProgramStage, uid } from '@hisptz/dhis2-utils'
import { compact, head, last, reduce, set, snakeCase, sortBy } from 'lodash'
import i18n from '@dhis2/d2-i18n'
//This process will only be done for the bottleneck setup that was in v1 of the app. That is why the IDs are hard coded.
export const BOTTLENECK_PROGRAM_ID = 'Uvz0nfKVMQJ'
export const OLD_DATASTORE_NAMESPACE = 'Standalone_Action_Tracker'
export const ACTION_PROGRAM_ID = 'unD7wro3qPm'
export const ACTION_STATUS_DATA_ELEMENT = 'f8JYVWLC7rE'
export const DATA_ELEMENT_LINKAGE = 'kBkyDytdOmC'
export const TRACKED_ENTITY_ATTRIBUTE_LINKAGE = 'Hi3IjyMXzeW'

export const STATUS_OPTION_SET = 'Y3FLpktyYMC'

export const START_DATE_ATTR = 'jFjnkx49Lg3'
export const END_DATE_ATTR = 'BYCbHJ46BOr'

function getCategories (programs: Program[]): CategoryConfig[] {
    const program = programs.find(p => p.id === BOTTLENECK_PROGRAM_ID)
    if (!program) throw new Error('Could not find bottleneck program')
    const mainCategory: CategoryConfig = {
        id: program.id,
        name: program.name?.replaceAll('[SAT]', '') as string,
        fields: program.programTrackedEntityAttributes?.map(({
                                                                 trackedEntityAttribute,
                                                                 mandatory
                                                             }, index) => {

            return {
                id: trackedEntityAttribute.id,
                name: (trackedEntityAttribute.formName ?? trackedEntityAttribute.shortName ?? trackedEntityAttribute.name).replaceAll('[SAT]', '') as string,
                shortName: trackedEntityAttribute.shortName,
                type: trackedEntityAttribute.valueType as string,
                optionSet: trackedEntityAttribute.optionSet,
                showAsColumn: index === 0,
                header: index === 0,
                mandatory
            }
        }) ?? []
    } as CategoryConfig

    const subCategories: CategoryConfig[] = sortBy(program
        .programStages, 'sortOrder')?.map(({
                                                                                           id,
                                                                                           programStageDataElements,
                                                                                           name
                                                                                       }) => {

        return {
            id,
            name: name?.replaceAll('[SAT]', ''),
            fields: compact(programStageDataElements?.map(({
                                                               dataElement,
                                                               compulsory
                                                           }, index) => {

                if (dataElement.name?.includes('Linkage')) {
                    return
                }
                return {
                    id: dataElement.id,
                    name: (dataElement.formName ?? dataElement.shortName ?? dataElement.name).replaceAll('[SAT]', '') as string,
                    shortName: dataElement.shortName,
                    type: dataElement.valueType as string,
                    optionSet: dataElement.optionSet,
                    mandatory: compulsory,
                    showAsColumn: index === 0,
                }
            }))
        }
    }) as CategoryConfig[]

    const categories = [mainCategory, ...subCategories]

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

function getAction (programs: Program[]): ActionConfig {
    const program = programs.find(p => p.id === ACTION_PROGRAM_ID)
    if (!program) throw new Error('Could not find action program')
    const actionConfig = {
        id: program.id,
        name: program.name?.replaceAll('[SAT]', '') as string,
        fields: compact(program.programTrackedEntityAttributes?.map(({
                                                                         trackedEntityAttribute,
                                                                         mandatory
                                                                     }, index) => {

            if (trackedEntityAttribute.name?.includes('Linkage')) {
                return
            }

            return {
                id: trackedEntityAttribute.id,
                name: (trackedEntityAttribute.formName ?? trackedEntityAttribute.shortName ?? trackedEntityAttribute.name).replaceAll('[SAT]', '') as string,
                shortName: trackedEntityAttribute.shortName,
                type: trackedEntityAttribute.valueType as string,
                optionSet: trackedEntityAttribute.optionSet,
                showAsColumn: index === 0,
                isStartDate: trackedEntityAttribute.id === START_DATE_ATTR,
                isEndDate: trackedEntityAttribute.id === END_DATE_ATTR,
                native: [START_DATE_ATTR, END_DATE_ATTR].includes(trackedEntityAttribute.id),
                mandatory
            }
        })) ?? []
    } as ActionConfig

    const actionStatusProgramStage = head(program?.programStages) as ProgramStage

    const actionStatusConfig: ActionStatusConfig = {
        id: actionStatusProgramStage.id,
        name: (actionStatusProgramStage.formName ?? actionStatusProgramStage.shortName ?? actionStatusProgramStage.name).replaceAll('[SAT]', '') as string,
        fields: actionStatusProgramStage
            .programStageDataElements?.map(({
                                                dataElement,
                                                compulsory
                                            }) => {
                return {
                    id: dataElement.id,
                    name: dataElement.formName ?? dataElement.shortName ?? dataElement.name as string,
                    shortName: dataElement.shortName,
                    type: dataElement.valueType as string,
                    optionSet: dataElement.optionSet,
                    native: dataElement.id === ACTION_STATUS_DATA_ELEMENT,
                    mandatory: compulsory,
                }
            }) as DataField[],
        dateConfig: {
            name: i18n.t('Review Date')
        },

        stateConfig: {
            dataElement: ACTION_STATUS_DATA_ELEMENT,
            optionSetId: STATUS_OPTION_SET
        }
    }

    return {
        ...actionConfig,
        statusConfig: actionStatusConfig
    }
}

function getGeneral (programs: Program[], defaultSettings: {
    planningOrgUnitLevel: string;
    planningPeriod: string;
    trackingPeriod: string
}): GeneralConfig {
    const program = head(programs) as Program

    return {
        sharing: program.sharing as unknown as SharingConfig,
        period: {
            planning: snakeCase(defaultSettings.planningPeriod).toUpperCase(),
            tracking: snakeCase(defaultSettings.trackingPeriod).toUpperCase()
        },
        orgUnit: {

            planning: defaultSettings.planningOrgUnitLevel,
            orgUnits: program.organisationUnits
        }
    }
}

export function generateConfigFromMetadata (metadata: {
    programs: Program[], defaultSettings: {
        planningOrgUnitLevel: string;
        planningPeriod: string;
        trackingPeriod: string
    }
}): Config {
    const categories = getCategories(metadata.programs)
    const actionConfig = getAction(metadata.programs)
    set(actionConfig, 'parent', {
        id: uid(),
        type: 'programStage',
        from: last(categories)?.id,
        name: last(categories)?.name
    })
    set(categories, `${categories.length - 1}.child`, {
        id: uid(),
        type: 'program',
        to: actionConfig.id
    })

    const generalConfig = getGeneral(metadata.programs, metadata.defaultSettings)

    return {
        id: uid(),
        name: 'Bottleneck',
        code: 'BNA',
        categories,
        action: actionConfig,
        general: generalConfig,
        meta: {
            linkageConfig: {
                trackedEntityAttribute: TRACKED_ENTITY_ATTRIBUTE_LINKAGE,
                dataElement: DATA_ELEMENT_LINKAGE
            }
        }
    }

}
