import { useMetadata } from "../../../hooks/metadata";
import { useMemo } from "react";
import { RHFDHIS2FormFieldProps } from "@hisptz/dhis2-ui";
import { getFieldProps, getFieldSchema } from "../../../utils/form";
import { useConfiguration } from "../../../hooks/config";
import { fromPairs } from "lodash";
import { useDimensions } from "../../../hooks";
import { z } from "zod";
import { ActionConfig, CategoryConfig } from "../../../schemas/config";

export function useFormMeta({
	id,
	type,
}: {
	id: string;
	type: "program" | "programStage";
}) {
	const { config } = useConfiguration();
	const { period } = useDimensions();
	const { programs } = useMetadata();
	const programStages = useMemo(
		() => programs?.map((program) => program.programStages).flat(),
		[programs],
	);
	const instanceConfig: CategoryConfig | ActionConfig | undefined = useMemo(
		() =>
			config?.categories.find((category) => category.id === id) ??
			config?.action,
		[config, id],
	);
	const instanceMeta = useMemo(() => {
		if (type === "program") {
			return programs?.find((program) => program.id === id);
		} else {
			return programStages?.find(
				(programStage) => programStage?.id === id,
			);
		}
	}, [programs, programStages, id, type]);

	const fields: RHFDHIS2FormFieldProps[] = useMemo(() => {
		const fieldsConfig = instanceConfig?.fields ?? [];
		const fieldsMetadata = !!instanceMeta?.programTrackedEntityAttributes
			? instanceMeta?.programTrackedEntityAttributes?.map(
					({ trackedEntityAttribute }: any) => trackedEntityAttribute,
				)
			: instanceMeta?.programStageDataElements?.map(
					({ dataElement }: any) => dataElement,
				) ?? [];

		return fieldsConfig
			.filter(({ hidden }) => !hidden)
			?.map((field) => {
				const fieldMeta = fieldsMetadata.find(
					({ id }: any) => id === field.id,
				);
				return getFieldProps({
					...field,
					...fieldMeta,
				});
			});
	}, [instanceConfig, instanceMeta]);

	const schema = useMemo(() => {
		return z.object(
			fromPairs(
				instanceConfig?.fields
					.filter(({ hidden }) => !hidden)
					?.map((field) => [
						field.id,
						getFieldSchema(field, {
							period,
						}),
					]),
			),
		);
	}, [instanceConfig?.fields]);

	return {
		fields,
		instanceMeta,
		instanceConfig,
		schema,
	};
}
