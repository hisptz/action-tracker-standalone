import {z} from "zod";

export const generalConfigSchema = z.object({
    period: z.object({
        planning: z.string(),
        tracking: z.string(),
        defaultPeriod: z.string().optional(),
    }),
    orgUnit: z.object({
        planning: z.string(),
        defaultOrgUnit: z.string().optional(),
    })
})

export const dataFieldSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum([
        'TEXT',
        'LONG_TEXT',
        'NUMBER',
        'INTEGER',
        'FILE_RESOURCE',
        'DATE',
    ]),
    showAsColumn: z.boolean().optional(),
    mandatory: z.boolean().optional(),
    optionSet: z.object({
        id: z.string()
    }).optional(),
    header: z.boolean().optional(),
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
    type: z.enum(['program', 'programStage']),
})

export const categoryConfigSchema = z.object({
    id: z.string(),
    name: z.string(),
    child: childSchema,
    fields: z.array(dataFieldSchema),
    parent: parentSchema.optional(),
    columns: z.array(z.object({
        id: z.string(),
        label: z.string(),
    }))
})
export const actionStatusState = z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
    completes: z.boolean().optional(),
    cancels: z.boolean().optional(),
})

export const actionStatusConfigSchema = z.object({
    id: z.string(),
    name: z.string(),
    fields: z.array(dataFieldSchema),
})
export const actionConfigSchema = z.object({
    id: z.string(),
    name: z.string(),
    fields: z.array(dataFieldSchema),
    statusConfig: actionStatusConfigSchema,
    parent: parentSchema.optional(),
    columns: z.array(z.object({
        id: z.string(),
        label: z.string(),
    }))
})

export const configSchema = z.object({
    id: z.string(),
    name: z.string({description: "Name of the configuration (useful for multiple configurations)"}),
    general: generalConfigSchema,
    categories: z.array(categoryConfigSchema),
    action: actionConfigSchema,
})

export type GeneralConfig = z.infer<typeof generalConfigSchema>;
export type ChildConfig = z.infer<typeof childSchema>;
export type ParentConfig = z.infer<typeof parentSchema>;
export type CategoryConfig = z.infer<typeof categoryConfigSchema>;
export type DataField = z.infer<typeof dataFieldSchema>;
export type ActionStatusState = z.infer<typeof actionStatusState>;
export type ActionStatusConfig = z.infer<typeof actionStatusConfigSchema>;
export type ActionConfig = z.infer<typeof actionConfigSchema>;

export type Config = z.infer<typeof configSchema>;
