import { Config } from "../../../../../../../shared/schemas/config";
import { head, tail } from "lodash";

export function getSharableItems(
	config: Config,
): Array<{ type: string; id: string }> {
	const programs = [head(config.categories)?.id, config.action?.id];
	const programStages = [
		tail(config.categories).map(({ id }) => id),
		config.action.statusConfig.id,
	].flat();

	const sharableItems: Array<{ type: string; id: string }> = [];
	programs.forEach((program) => {
		if (program) {
			sharableItems.push({
				type: "program",
				id: program,
			});
		}
	});
	programStages.forEach((programStage) => {
		sharableItems.push({
			type: "programStage",
			id: programStage,
		});
	});
	return sharableItems;
}
