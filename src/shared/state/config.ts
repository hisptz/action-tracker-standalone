import { selector, selectorFamily } from "recoil";
import { type Config } from "../schemas/config";
import { DataEngineState } from "./engine";
import { DATASTORE_NAMESPACE } from "../constants/meta";
import { type Program } from "@hisptz/dhis2-utils";
import { head } from "lodash";
import { OptionSet } from "../types/dhis2";
import { CustomError } from "../models/error";
import i18n from "@dhis2/d2-i18n";
import { IconBlock24 } from "@dhis2/ui";

const query: any = {
	config: {
		resource: `dataStore/${DATASTORE_NAMESPACE}`,
		id: ({ id }: { id: string }) => id,
	},
};

const configKeysQuery: any = {
	config: {
		resource: `dataStore/${DATASTORE_NAMESPACE}`,
	},
};

const keysToExclude = ["settings", "savedObjects", "logs"];

export const ConfigIdsState = selector({
	key: "config-ids",
	get: async ({ get }) => {
		const engine = get(DataEngineState);
		const { config } = await engine.query(configKeysQuery);
		return (config as string[])?.filter(
			(key) => !keysToExclude.includes(key),
		);
	},
});

export const ConfigState = selectorFamily<Config | null, string | undefined>({
	key: "config-state",
	get:
		(id?: string) =>
		async ({ get }) => {
			if (!id) {
				return null;
			}
			const engine = get(DataEngineState);
			try {
				const { config } = await engine.query(query, {
					variables: { id },
				});
				return config as Config;
			} catch (e: any) {
				if (e.details.httpStatusCode === 403) {
					throw new CustomError({
						message: i18n.t(
							"You do not have access to view this configuration",
						),
						name: i18n.t("Access Denied"),
						icon: IconBlock24,
						actions: [
							{
								action: ({ navigate }) => {
									navigate("/");
								},
								label: i18n.t("Go back home"),
								primary: true,
							},
						],
					});
				}
				return null;
			}
		},
});

const metadataQuery: any = {
	programs: {
		resource: "programs",
		params: ({ ids }: { ids: string[] }) => ({
			filter: [`id:in:[${ids.join(",")}]`],
			fields: [
				"id",
				"displayName",
				"trackedEntityType",
				"programTrackedEntityAttributes[mandatory,trackedEntityAttribute[id,displayName,valueType,shortName,formName,optionSet[id,options[code,name]]]]",
				"programStages[id,displayName,program[id],programStageDataElements[mandatory,dataElement[id,displayName,shortName,valueType,formName,optionSet[id,options[code,name]]]]]",
			],
		}),
	},
	status: {
		resource: "optionSets",
		id: ({ statusOptionSetId }: { statusOptionSetId: string }) =>
			statusOptionSetId,
		params: {
			fields: ["id", "name", "options[code,name,style[color,icon]]"],
		},
	},
};
export const MetadataState = selectorFamily<
	{
		programs: { programs: Program[] };
		status: OptionSet;
	} | null,
	string | undefined
>({
	key: "metadata-state",
	get:
		(id?: string) =>
		async ({ get }) => {
			if (!id) {
				return null;
			}
			const engine = get(DataEngineState);
			const config = get(ConfigState(id));

			if (!config) {
				return null;
			}
			const categoryProgram = head(config?.categories)?.id;
			const actionProgram = config?.action.id;

			const programs = [categoryProgram, actionProgram];

			try {
				return (await engine.query(metadataQuery, {
					variables: {
						ids: programs,
						statusOptionSetId:
							config.action.statusConfig.stateConfig.optionSetId,
					},
				})) as { programs: { programs: Program[] }; status: OptionSet };
			} catch (e) {
				return null;
			}
		},
});
