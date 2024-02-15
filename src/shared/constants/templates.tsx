import { Template } from "../../modules/GetStarted/components/TemplateCard";
import i18n from "@dhis2/d2-i18n";
import React from "react";
import { ReactComponent as BasicTracking } from "../../shared/assets/images/basic.svg";
import { ReactComponent as SecondaryTracking } from "../../shared/assets/images/secondary.svg";
import { ReactComponent as TertiaryTracking } from "../../shared/assets/images/basic-tracking.svg";
import { ReactComponent as BNAIcon } from "../../shared/assets/images/bna.svg";
import { generateBasicTemplate, generateLegacyTemplate } from "./defaults";
import { Attribute } from "../types/dhis2";
import { DataEngine } from "../types/engine";
import { z } from "zod";
import { DATASTORE_NAMESPACE } from "./meta";
import { isEmpty } from "lodash";
import { RHFDHIS2FormFieldProps } from "@hisptz/dhis2-ui";
import valueType = Attribute.valueType;

const commonVariables: RHFDHIS2FormFieldProps[] = [
	{
		label: i18n.t("Name"),
		valueType: valueType.TEXT,
		name: "name",
		required: true,
	},
	{
		label: i18n.t("Code"),
		valueType: valueType.TEXT,
		name: "code",
		required: true,
		helpText: i18n.t("Should be at most 10 characters"),
	},
];

const query: any = {
	config: {
		resource: `dataStore/${DATASTORE_NAMESPACE}`,
		params: ({ name, code }: { name: string; code: string }) => {
			return {
				fields: ["name"],
				filter: [`name:eq:${name}`, `code:eq:${code}`],
				rootJunction: "or",
			};
		},
	},
};
const commonValidatorsGenerator = ({ engine }: { engine: DataEngine }) => {
	return z.object({
		name: z
			.string()
			.max(50, i18n.t("Name should not exceed 50 characters"))
			.refine(async (value) => {
				const configs = (await engine.query(query, {
					variables: {
						name: value,
					},
				})) as unknown as {
					config: {
						entries: Array<{
							key: string;
							code: string;
							name: string;
						}>;
					};
				};
				return isEmpty(configs.config.entries);
			}, i18n.t("A configuration with this name already exists")),
		code: z
			.string()
			.max(10, i18n.t("Code should not exceed 10 characters"))
			.refine(async (value) => {
				const configs = (await engine.query(query, {
					variables: {
						code: value,
					},
				})) as unknown as {
					config: {
						entries: Array<{
							key: string;
							code: string;
							name: string;
						}>;
					};
				};
				return isEmpty(configs.config.entries);
			}, i18n.t("A configuration with this code already exists")),
	});
};
export const configTemplates: Template[] = [
	{
		id: "basic-tracking",
		title: i18n.t("Basic activity tracking"),
		description: i18n.t(
			"Activity tracking model with one level of categorization",
		),
		icon: <BasicTracking />,
		defaultVariables: {
			name: i18n.t("Basic activity tracking"),
			code: "BAT",
		},
		variables: [...commonVariables],
		configGenerator: generateBasicTemplate(1),
		validationGenerator: commonValidatorsGenerator,
	},
	{
		id: "two-level-tracking",
		title: i18n.t("Secondary activity tracking"),
		description: i18n.t(
			"Activity tracking model with two levels of categorization",
		),
		icon: <SecondaryTracking />,
		defaultVariables: {
			name: i18n.t("Secondary activity tracking"),
			code: "SAT",
		},
		variables: [...commonVariables],
		configGenerator: generateBasicTemplate(2),
		validationGenerator: commonValidatorsGenerator,
	},
	{
		id: "three-level-tracking",
		title: i18n.t("Tertiary activity tracking"),
		description: i18n.t(
			"Activity tracking model with three levels of categorization",
		),
		icon: <TertiaryTracking />,
		defaultVariables: {
			name: i18n.t("Tertiary activity tracking"),
			code: "TAT",
		},
		variables: [...commonVariables],
		configGenerator: generateBasicTemplate(3),
		validationGenerator: commonValidatorsGenerator,
	},
	{
		id: "bna-actions-tracking",
		title: i18n.t("BNA linked action tracking"),
		description: i18n.t(
			"Use the BNA like categorization to track activities",
		),
		icon: <BNAIcon />,
		disabled: true,
		variables: [...commonVariables],
		defaultVariables: {
			name: "BNA action tracking",
			code: "BNA",
		},
		configGenerator: generateLegacyTemplate,
		validationGenerator: commonValidatorsGenerator,
	},
];
