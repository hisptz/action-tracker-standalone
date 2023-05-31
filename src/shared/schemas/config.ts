import {z} from "zod";

export const generalConfigSchema = z.object({
    period: z.object({
        planning: z.string(),
        tracking: z.string()
    }),
    orgUnit: z.object({
        planning: z.string(),
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
    mandatory: z.boolean().optional(),
    options: z.array(z.object({
        name: z.string(),
        code: z.string(),
        id: z.string(),
        color: z.string().optional(),
        icon: z.string().optional()
    })).optional()
})

export const categoryConfigSchema = z.object({
    id: z.string(),
    name: z.string(),
    fields: z.array(dataFieldSchema)
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
})
export const actionConfigSchema = z.object({
    id: z.string(),
    name: z.string(),
    fields: z.array(dataFieldSchema),
    statusConfig: actionStatusConfigSchema
})

export const configSchema = z.object({
    id: z.string(),
    name: z.string({description: "Name of the configuration (useful for multiple configurations)"}),
    general: generalConfigSchema,
    categories: z.array(categoryConfigSchema),
    action: actionConfigSchema
})

export type GeneralConfig = z.infer<typeof generalConfigSchema>;
export type CategoryConfig = z.infer<typeof categoryConfigSchema>;
export type DataField = z.infer<typeof dataFieldSchema>;
export type ActionStatusState = z.infer<typeof actionStatusState>;
export type ActionStatusConfig = z.infer<typeof actionStatusConfigSchema>;
export type ActionConfig = z.infer<typeof actionConfigSchema>;

export type Config = z.infer<typeof configSchema>;
