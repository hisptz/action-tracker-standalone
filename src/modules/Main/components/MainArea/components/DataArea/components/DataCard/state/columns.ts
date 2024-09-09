import { atomFamily, selectorFamily } from "recoil";
import { FixedPeriod } from "@dhis2/multi-calendar-dates/build/types/period-calculation/types";
import { DateTime, Interval } from "luxon";

export interface ColumnStateConfig {
	id: string;
	visible: boolean;
	width: number;
	name: string;
	from: string;
}

export interface ActionTrackingColumnStateConfig extends ColumnStateConfig {
	from: "tracking";
	period: FixedPeriod & {
		interval: Interval;
		start: DateTime;
		end: DateTime;
	};
}

export const ColumnState = atomFamily<ColumnStateConfig[], string>({
	key: "column-state",
	default: [],
});

export const VisibleColumnState = selectorFamily<ColumnStateConfig[], string>({
	key: "visible-column-state",
	get:
		(id: string) =>
		({ get }) => {
			const columns = get(ColumnState(id));
			return columns.filter((column) => column.visible);
		},
});

export const TrackingColumnsState = selectorFamily<
	ActionTrackingColumnStateConfig[],
	string
>({
	key: "tracking-columns-state",
	get:
		(id: string) =>
		({ get }) => {
			const columns = get(VisibleColumnState(id));
			return columns.filter(
				(column) => column.from === "tracking",
			) as ActionTrackingColumnStateConfig[];
		},
});
