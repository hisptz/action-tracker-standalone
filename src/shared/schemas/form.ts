import {
    actionConfigSchema,
    actionStatusConfigSchema,
    actionStatusState,
    categoryConfigSchema,
    dataFieldSchema,
    generalConfigSchema
} from "./config";
import {z} from "zod";

export const actionStatusFormState = actionStatusState.omit({id: true})

export const dataFieldFormSchema = dataFieldSchema.omit({id: true})


export const actionStatusConfigFormSchema = actionStatusConfigSchema.omit({id: true}).extend({
    fields: z.array(dataFieldFormSchema),
    states: z.array(actionStatusFormState)
});
export const actionConfigFormSchema = actionConfigSchema.omit({id: true}).extend({
    statusConfig: actionStatusConfigFormSchema,
});

export const categoryConfigFormSchema = categoryConfigSchema.omit({id: true}).extend({
    fields: z.array(dataFieldFormSchema)
})

const configFormSchema = z.object({
    name: z.string(),
    general: generalConfigSchema,
    categories: z.array(categoryConfigFormSchema),
    actions: z.array(actionConfigFormSchema),
})

export type ConfigForm = z.infer<typeof configFormSchema>
