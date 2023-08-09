import { z } from 'zod'
import { Attribute } from '../types/dhis2'
import valueType = Attribute.valueType

export const sharingConfigSchema = z.object({
    owner: z.string().optional(),
    public: z.string().optional(),
    users: z.object({}).optional(),
    userGroups: z.object({}).optional()
})
export const generalConfigSchema = z.object({
    period: z.object({
        planning: z.string(),
        tracking: z.string(),
        defaultPeriod: z.string().optional()
    }),
    orgUnit: z.object({
        orgUnits: z.array(z.object({
            id: z.string(),
            path: z.string()
        })).optional(),
        planning: z.string().optional(),
        accessAll: z.boolean().optional(),
        defaultOrgUnit: z.string().optional()
    }),
    sharing: sharingConfigSchema
})

export const dataFieldSchema = z.object({
    id: z.string(),
    name: z.string(),
    shortName: z.string(),
    type: z.nativeEnum(valueType),
    showAsColumn: z.boolean().optional(),
    mandatory: z.boolean().optional(),
    optionSet: z.object({
        id: z.string()
    }).optional(),
    header: z.boolean().optional(),
    native: z.boolean({ description: 'This field should be in every configuration' }).optional(),
    hidden: z.boolean({ description: 'Hidden from normal user operations. Normally linkages' }).optional(),
    isStartDate: z.boolean({ description: 'Field should be flagged as start date (Works for action only for now)' }).optional(),
    isEndDate: z.boolean({ description: 'Field should be flagged as end date (Works for action only for now)' }).optional()
})

const parentSchema = z.object({
    id: z.string(),
    from: z.string(),
    type: z.enum(['program', 'programStage']),
    name: z.string()
})

const childSchema = z.object({
    id: z.string(),
    to: z.string(),
    type: z.enum(['program', 'programStage'])
})

export const categoryConfigSchema = z.object({
    id: z.string(),
    name: z.string(),
    child: childSchema,
    fields: z.array(dataFieldSchema),
    type: z.enum(['program', 'programStage']),
    parent: parentSchema.optional()
})
export const actionStatusState = z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
    completes: z.boolean().optional(),
    cancels: z.boolean().optional()
})
export const actionStatusConfigSchema = z.object({
    id: z.string(),
    name: z.string(),
    fields: z.array(dataFieldSchema),
    stateConfig: z.object({
        dataElement: z.string(),
        optionSetId: z.string(),
    }),
    dateConfig: z.object({
        name: z.string()
    })
})
export const actionConfigSchema = z.object({
    id: z.string(),
    name: z.string(),
    fields: z.array(dataFieldSchema),
    type: z.literal('program'),
    statusConfig: actionStatusConfigSchema,
    parent: parentSchema.optional()
})

export const linkageConfigSchema = z.object({
    trackedEntityAttribute: z.string(),
    dataElement: z.string()
})
export const metaSchema = z.object({
    linkageConfig: linkageConfigSchema
})

export const configSchema = z.object({
    id: z.string(),
    code: z.string(),
    name: z.string({ description: 'Name of the configuration (useful for multiple configurations)' }),
    general: generalConfigSchema,
    categories: z.array(categoryConfigSchema),
    action: actionConfigSchema,
    meta: metaSchema
})

export type GeneralConfig = z.infer<typeof generalConfigSchema>;
export type SharingConfig = z.infer<typeof sharingConfigSchema>
export type ChildConfig = z.infer<typeof childSchema>;
export type ParentConfig = z.infer<typeof parentSchema>;
export type CategoryConfig = z.infer<typeof categoryConfigSchema>;
export type DataField = z.infer<typeof dataFieldSchema>;
export type ActionStatusState = z.infer<typeof actionStatusState>;
export type ActionStatusConfig = z.infer<typeof actionStatusConfigSchema>;
export type ActionConfig = z.infer<typeof actionConfigSchema>;
export type LinkageConfig = z.infer<typeof linkageConfigSchema>;

export type Config = z.infer<typeof configSchema>;
