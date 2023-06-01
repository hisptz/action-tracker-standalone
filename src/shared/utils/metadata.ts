import {ActionConfig, ActionStatusConfig, CategoryConfig, Config, DataField} from "../schemas/config";
import {
    DataElement,
    DHIS2ValueType,
    Option,
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
        name: `[SAT] ${field.name}`,
        formName: field.name,
        id: field.id,
        code: field.name,
        shortName: field.name,
        valueType: field.type as DHIS2ValueType,
        aggregationType: "NONE",
        domainType: "TRACKER"
    }

    if (!isEmpty(field.options)) {
        const optionSetId = uid();
        set(dataItem, 'optionSet', {
            id: optionSetId,
            name: `[SAT] ${field.name} options`,
            options: field.options?.map((option, index) => ({
                ...option,
                id: uid(),
                sortOrder: index + 1,
                optionSet: {id: optionSetId}
            })),
            valueType: field.type as DHIS2ValueType
        })
    }
    return dataItem;

}

function generateProgramFromConfig(config: CategoryConfig | ActionConfig, trackedEntityType: TrackedEntityType): Program {

    const programTrackedEntityAttributes: ProgramTrackedEntityAttribute[] = config.fields.map(generateDataItemsFromConfig).map(trackedEntityAttribute => {
        const teiConfig = find(config.fields, ['id', trackedEntityAttribute.id]);
        return {
            trackedEntityAttribute,
            id: uid(),
            mandatory: teiConfig?.mandatory
        } as any

    }) as ProgramTrackedEntityAttribute[];

    return {
        id: config.id,
        programType: "WITH_REGISTRATION",
        programTrackedEntityAttributes,
        name: `[SAT] ${config.name}`,
        shortName: config.name,
        trackedEntityType
    }
}

function generateProgramStageFromConfig(config: CategoryConfig | ActionStatusConfig, {programId, index, options}: {
    programId: string;
    index: number;
    options?: {
        repeatable: boolean
    }
}): ProgramStage {

    const dataElements = config.fields.map(generateDataItemsFromConfig) as DataElement[]
    const programStageDataElements = dataElements.map(dataElement => {
        const dEConfig = find(config.fields, ['id', dataElement.id]);

        return {
            dataElement,
            compulsory: dEConfig?.mandatory,
            id: uid()
        }
    }) as any
    return {
        name: `[SAT] ${config.name}`,
        id: config.id,
        programStageDataElements,
        sortOrder: index + 1,
        program: {
            id: programId
        },
        programStageSections: [],
        ...(options ?? {})
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
    const programStages = restCategories?.map((category, index) => generateProgramStageFromConfig(category, {
        programId: program.id,
        index,
    }));

    return {
        program,
        programStages,
    }
}

function generateActionsMetadata(actionConfig: ActionConfig, meta: InitialMetadata) {
    const trackedEntityType = find(meta.trackedEntityTypes, ['name', EntityTypes.ACTION])
    const program = generateProgramFromConfig(actionConfig, trackedEntityType as TrackedEntityType);
    const programStage = generateProgramStageFromConfig(actionConfig.statusConfig, {
        programId: program.id,
        index: 0,
        options: {repeatable: true}
    });
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

function extractOptions(optionSets: OptionSet[]): (Option | undefined)[] {
    return optionSets.flatMap(optionSet => optionSet.options) ?? [] as Option[]
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
    const optionSets = compact(extractOptionSets({dataElements, trackedEntityAttributes}));
    const options = compact(extractOptions(optionSets))

    return {
        dataElements,
        trackedEntityAttributes,
        options,
        optionSets,
        programs,
        programStages,
    }

}
