import {
    type ActionConfig,
    type ActionStatusConfig,
    type CategoryConfig,
    type Config,
    type DataField,
    type SharingConfig
} from '../schemas/config'
import {
    type DataElement,
    type DHIS2ValueType,
    type Program,
    type ProgramStage,
    type ProgramTrackedEntityAttribute,
    type TrackedEntityAttribute,
    type TrackedEntityType,
    uid
} from '@hisptz/dhis2-utils'
import { compact, filter, find } from 'lodash'
import { EntityTypes, type InitialMetadata } from '../constants/defaults'

export interface MetaMeta extends InitialMetadata {
    orgUnits: Array<{ id: string, path: string }>
    sharing: SharingConfig
}

function generateDataItemsFromConfig (field: DataField): TrackedEntityAttribute | DataElement {
    return {
        name: `[SAT] ${field.name}`,
        formName: field.name,
        id: field.id ?? uid(),
        code: field.name,
        shortName: field.name,
        valueType: field.type as DHIS2ValueType,
        aggregationType: 'NONE',
        domainType: 'TRACKER',
        optionSet: field.optionSet?.id !== undefined ? field.optionSet : undefined
    }
}

function generateProgramFromConfig (config: CategoryConfig | ActionConfig, trackedEntityType: TrackedEntityType, { meta }: {
    meta: MetaMeta
}): Program {
    const programTrackedEntityAttributes: ProgramTrackedEntityAttribute[] = config.fields.map(generateDataItemsFromConfig).map(trackedEntityAttribute => {
        const teiConfig = find(config.fields, ['id', trackedEntityAttribute.id])
        return {
            trackedEntityAttribute: {
                ...trackedEntityAttribute,
                sharing: meta.sharing
            },
            sharing: meta.sharing,
            id: uid(),
            mandatory: teiConfig?.mandatory
        } as any
    }) as ProgramTrackedEntityAttribute[]

    return {
        id: config.id,
        programType: 'WITH_REGISTRATION',
        programTrackedEntityAttributes,
        name: `[SAT] ${config.name}`,
        shortName: config.name,
        trackedEntityType,
        sharing: meta.sharing as any
    }
}

function generateProgramStageFromConfig (config: CategoryConfig | ActionStatusConfig, {
    meta,
    programId,
    index,
    options
}: {
    programId: string
    meta: MetaMeta
    index: number
    options?: {
        repeatable: boolean
    }
}): ProgramStage {
    const dataElements = config.fields.map(generateDataItemsFromConfig) as DataElement[]
    const programStageDataElements = dataElements.map(dataElement => {
        const dEConfig = find(config.fields, ['id', dataElement.id])
        return {
            dataElement: {
                ...dataElement,
                sharing: meta.sharing
            },
            sharing: meta.sharing,
            compulsory: dEConfig?.mandatory,
            id: uid()
        }
    }) as any
    return {
        name: `[SAT] ${config.name}`,
        sharing: meta.sharing as any,
        id: config.id,
        programStageDataElements,
        sortOrder: index + 1,
        repeatable: true,
        program: {
            id: programId
        },
        programStageSections: [],
        ...(options ?? {})
    }
}

function generateCategoriesMetadata (categories: CategoryConfig[], meta: MetaMeta) {
    const trackedEntityType = find(meta.trackedEntityTypes, ['name', EntityTypes.CATEGORIZATION])
    if (categories.length === 1) {
        return {
            program: {
                ...generateProgramFromConfig(categories[0], trackedEntityType as TrackedEntityType, { meta }),
                organisationUnits: meta.orgUnits
            },
            programStages: []
        }
    }

    const [firstCategory, ...restCategories] = categories
    const program = {
        ...generateProgramFromConfig(firstCategory, trackedEntityType as TrackedEntityType, { meta }),
        organisationUnits: meta.orgUnits
    }
    const programStages = restCategories?.map((category, index) => generateProgramStageFromConfig(category, {
        programId: program.id,
        meta,
        index
    }))

    return {
        program,
        programStages
    }
}

function generateActionsMetadata (actionConfig: ActionConfig, meta: MetaMeta) {
    const trackedEntityType = find(meta.trackedEntityTypes, ['name', EntityTypes.ACTION])
    const program = generateProgramFromConfig(actionConfig, trackedEntityType as TrackedEntityType, { meta })
    const programStage = generateProgramStageFromConfig(actionConfig.statusConfig, {
        programId: program.id,
        meta,
        index: 0,
        options: { repeatable: true }
    })
    return {
        program: {
            ...program,
            organisationUnits: meta.orgUnits
        },
        programStages: [programStage]
    }
}

function extractTrackedEntityAttributes (programs: Program[]) {
    return programs.flatMap(program => program.programTrackedEntityAttributes?.map(programTrackedEntityAttribute => programTrackedEntityAttribute.trackedEntityAttribute))
}

function generateRelationshipTypes (config: Config) {
    const categoriesWithParents = config.categories.filter(({ parent }) => !(parent == null))
    const sharing = config.general.sharing
    const relationshipTypes = categoriesWithParents.map(({
                                                             parent,
                                                             name,
                                                             id
                                                         }) => {
        if (parent == null) return
        return {
            id: parent?.id,
            name: `[SAT] ${parent.name} to ${name} relationship`,
            fromToName: `[SAT] ${parent.from} children`,
            fromConstraint: {
                relationshipEntity: parent?.type === 'program' ? 'PROGRAM_INSTANCE' : 'PROGRAM_STAGE_INSTANCE',
                [parent.type]: {
                    id: parent?.from
                }
            },
            toFromName: `[SAT] Parent`,
            sharing,
            toConstraint: {
                relationshipEntity: 'PROGRAM_STAGE_INSTANCE',
                programStage: {
                    id
                }
            }
        }
    })
    const actionConfig = config.action

    const actionRelationType = {
        id: actionConfig.parent?.id,
        name: `[SAT] ${actionConfig.parent?.name as string} to ${actionConfig.name} relationship`,
        fromToName: `[SAT] ${actionConfig.parent?.from as string} children`,
        fromConstraint: {
            relationshipEntity: actionConfig.parent?.type === 'program' ? 'PROGRAM_INSTANCE' : 'PROGRAM_STAGE_INSTANCE',
            [actionConfig.parent?.type as string]: {
                id: actionConfig.parent?.from
            }
        },
        toFromName: `[SAT] Parent`,
        toConstraint: {
            relationshipEntity: 'PROGRAM_INSTANCE',
            program: {
                id: actionConfig.id
            }
        },
        sharing
    }

    return [...relationshipTypes, actionRelationType]
}

function extractDataElements (programStages: ProgramStage[]) {
    return programStages.flatMap(programStage => programStage.programStageDataElements?.map(programStageDataElement => programStageDataElement.dataElement))
}

function cleanProgramDeps (programs: Program[], stages: ProgramStage[]) {
    return programs.map(program => {
        return {
            ...program,
            programTrackedEntityAttributes: program.programTrackedEntityAttributes?.map((ptea) => {
                return {
                    ...ptea,
                    trackedEntityAttribute: {
                        id: ptea.trackedEntityAttribute.id
                    }
                }
            }),
            programStages: filter(stages, (stage) => stage.program?.id === program.id)?.map((programStage) => {
                return {
                    id: programStage.id,
                    sortOrder: programStage.sortOrder
                }
            })
        }
    })
}

function cleanProgramStagesDeps (programStages: ProgramStage[]) {
    return programStages.map(programStage => {
        return {
            ...programStage,
            programStageDataElements: programStage.programStageDataElements?.map((pstd) => {
                return {
                    ...pstd,
                    dataElement: {
                        id: pstd.dataElement.id
                    }
                }
            })
        }
    })
}

export function generateMetadataFromConfig (config: Config, { meta }: { meta: InitialMetadata }) {
    const {
        program: categoryProgram,
        programStages: categoriesProgramStage
    } = generateCategoriesMetadata(config.categories, {
        ...meta,
        orgUnits: config.general.orgUnit.orgUnits ?? [],
        sharing: config.general.sharing
    }) ?? {}
    const {
        program: actionProgram,
        programStages: actionProgramStages
    } = generateActionsMetadata(config.action, {
        ...meta,
        orgUnits: config.general.orgUnit.orgUnits ?? [],
        sharing: config.general.sharing
    }) ?? {}

    const programs = [categoryProgram, actionProgram]
    const programStages = [...categoriesProgramStage, ...actionProgramStages]

    const trackedEntityAttributes = compact(extractTrackedEntityAttributes(programs)) ?? []
    const dataElements = compact(extractDataElements(programStages)) ?? []

    const cleanedProgram = cleanProgramDeps(programs, programStages)
    const cleanedProgramStages = cleanProgramStagesDeps(programStages)

    const relationshipTypes = generateRelationshipTypes(config)

    return {
        dataElements,
        trackedEntityAttributes,
        programs: cleanedProgram,
        programStages: cleanedProgramStages,
        relationshipTypes
    }
}

export function getAttributeValueFromList (attributeId: string, attributes: Array<{
    attribute: string
    value: string
}>): string {
    return find(attributes, ['attribute', attributeId])?.value ?? ''
}
