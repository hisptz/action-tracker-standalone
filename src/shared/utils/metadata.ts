import {ActionConfig, ActionStatusConfig, CategoryConfig, Config, DataField} from "../schemas/config";
import {
    DataElement,
    DHIS2ValueType,
    OptionSet,
    Program,
    ProgramStage,
    ProgramTrackedEntityAttribute,
    TrackedEntityAttribute,
    TrackedEntityType,
    uid
} from "@hisptz/dhis2-utils";
import {compact, find, isEmpty, set, uniqBy} from "lodash";
import {EntityTypes, InitialMetadata} from "../constants/defaults";


function generateDataItemsFromConfig(field: DataField): TrackedEntityAttribute | DataElement {
    const dataItem = {
        name: field.name,
        id: field.id,
        code: field.name,
        shortName: field.name,
        valueType: field.type as DHIS2ValueType,
    }

    if (!isEmpty(field.options)) {
        set(dataItem, 'optionSet', {
            id: uid(),
            name: `${field.name} options`,
            options: field.options?.map((option, index) => ({...option, id: uid(), sortOrder: index + 1}))
        })
    }
    return dataItem;

}

function generateProgramFromConfig(config: CategoryConfig | ActionConfig, trackedEntityType: TrackedEntityType): Program {

    const programTrackedEntityAttributes: ProgramTrackedEntityAttribute[] = config.fields.map(generateDataItemsFromConfig).map(trackedEntityAttribute => ({
        trackedEntityAttribute,
        id: uid()
    })) as ProgramTrackedEntityAttribute[];

    return {
        id: config.id,
        programType: "WITH_REGISTRATION",
        programTrackedEntityAttributes,
        name: config.name,
        trackedEntityType
    }
}

function generateProgramStageFromConfig(config: CategoryConfig | ActionStatusConfig, {programId}: {
    programId: string
}): ProgramStage {

    const dataElements = config.fields.map(generateDataItemsFromConfig) as DataElement[]
    const programStageDataElements = dataElements.map(dataElement => ({
            dataElement,
            id: uid()
        }
    )) as any
    return {
        name: config.name,
        id: config.id,
        programStageDataElements,
        program: {
            id: programId
        },
        programStageSections: []
    }
}


function generateCategoriesMetadata(categories: CategoryConfig[], meta: InitialMetadata) {
    const trackedEntityType = find(meta.trackedEntityTypes, ['name', EntityTypes.CATEGORIZATION])
    if (categories.length === 1) {
        return {
            program: generateProgramFromConfig(categories[0], trackedEntityType as TrackedEntityType),
            programStages: []
        }
    }

    const [firstCategory, ...restCategories] = categories;
    const program = generateProgramFromConfig(firstCategory, trackedEntityType as TrackedEntityType);
    const programStages = restCategories?.map(category => generateProgramStageFromConfig(category, {programId: program.id}));

    return {
        program,
        programStages,
    }
}

function generateActionsMetadata(actionConfig: ActionConfig, meta: InitialMetadata) {
    const trackedEntityType = find(meta.trackedEntityTypes, ['name', EntityTypes.ACTION])
    const program = generateProgramFromConfig(actionConfig, trackedEntityType as TrackedEntityType);
    const programStage = generateProgramStageFromConfig(actionConfig.statusConfig, {programId: program.id});
    return {
        program,
        programStages: [programStage],
    }
}

function extractTrackedEntityAttributes(programs: Program[]) {
    return programs.flatMap(program => program.programTrackedEntityAttributes?.map(programTrackedEntityAttribute => programTrackedEntityAttribute.trackedEntityAttribute))
}

function extractDataElements(programStages: ProgramStage[]) {
    return programStages.flatMap(programStage => programStage.programStageDataElements?.map(programStageDataElement => programStageDataElement.dataElement))
}

function extractOptionSets({dataElements, trackedEntityAttributes}: {
    dataElements: DataElement[],
    trackedEntityAttributes: TrackedEntityAttribute[]
}): OptionSet[] {
    const dataElementOptionSets = dataElements.flatMap(dataElement => dataElement.optionSet as OptionSet)
    const trackedEntityAttributeOptionSets = trackedEntityAttributes.flatMap(trackedEntityAttribute => trackedEntityAttribute.optionSet as OptionSet)
    return uniqBy([...dataElementOptionSets, ...trackedEntityAttributeOptionSets], 'id')
}

export function generateMetadataFromConfig(config: Config, {meta}: { meta: InitialMetadata }) {
    const {
        program: categoryProgram,
        programStages: categoriesProgramStage
    } = generateCategoriesMetadata(config.categories, meta) ?? {};
    const {
        program: actionProgram,
        programStages: actionProgramStages
    } = generateActionsMetadata(config.action, meta) ?? {};

    const programs = [categoryProgram, actionProgram];
    const programStages = [...categoriesProgramStage, ...actionProgramStages];

    const trackedEntityAttributes = compact(extractTrackedEntityAttributes(programs)) ?? [];
    const dataElements = compact(extractDataElements(programStages)) ?? [];
    const optionSets = compact(extractOptionSets({dataElements, trackedEntityAttributes}))

    return {
        dataElements,
        trackedEntityAttributes,
        optionSets,
        programs,
        programStages,
    }

}
