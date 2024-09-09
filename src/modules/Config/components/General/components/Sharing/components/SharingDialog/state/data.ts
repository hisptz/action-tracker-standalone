import { selectorFamily } from "recoil";
import { DataEngineState } from "../../../../../../../../../shared/state/engine";
import { head, isEmpty } from "lodash";

const query = {
	search: {
		resource: "sharing/search",
		params: ({ search }: any) => ({
			key: search,
		}),
	},
};
export const AccessEntityState = selectorFamily<
	Promise<{ id: string; name: string; displayName: string } | null>,
	string
>({
	key: "accessEntity",
	get:
		(id: string) =>
		async ({ get }) => {
			const engine = get(DataEngineState);
			const response = (await engine.query(query, {
				variables: { search: id },
			})) as {
				search: {
					userGroups: Array<{
						id: string;
						name: string;
						displayName: string;
					}>;
					users: Array<{
						id: string;
						name: string;
						displayName: string;
					}>;
				};
			};
			if (!isEmpty(response.search.users)) {
				return (
					head<{ id: string; name: string; displayName: string }>(
						response.search.users,
					) ?? null
				);
			}
			if (!isEmpty(response.search.userGroups)) {
				return (
					head<{ id: string; name: string; displayName: string }>(
						response.search.userGroups,
					) ?? null
				);
			}

			return null;
		},
});
