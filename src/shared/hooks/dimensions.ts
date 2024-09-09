import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { createFixedPeriodFromPeriodId } from "@dhis2/multi-calendar-dates";
import { useCalendar } from "./calendar";
import { DateTime, Interval } from "luxon";

export function useDimensions() {
	const [params, setParams] = useSearchParams();
	const calendar = useCalendar();
	const period = useMemo(() => {
		if (params.get("pe") == null) return undefined;

		const period = createFixedPeriodFromPeriodId({
			calendar,
			periodId: params.get("pe")!,
		});

		return {
			...period,
			interval: Interval.fromDateTimes(
				DateTime.fromFormat(period.startDate, "yyyy-MM-dd").startOf(
					"day",
				),
				DateTime.fromFormat(period.endDate, "yyyy-MM-dd").endOf("day"),
			),
			start: DateTime.fromFormat(period.startDate, "yyyy-MM-dd").startOf(
				"day",
			),
			end: DateTime.fromFormat(period.endDate, "yyyy-MM-dd").endOf("day"),
		};
	}, [params.get("pe")]);

	const setParam = useCallback(
		(key: string) => (value: string) => {
			setParams((prev) => {
				const updatedParams = new URLSearchParams(prev);
				updatedParams.set(key, value);
				return updatedParams;
			});
		},
		[setParams],
	);

	const setPeriod = useCallback(setParam("pe"), [setParam]);
	const setOrgUnit = useCallback(setParam("ou"), [setParam]);

	return {
		period,
		orgUnit: { id: params.get("ou") },
		setPeriod,
		setOrgUnit,
	};
}

export function usePageType() {
	const [searchParams] = useSearchParams();
	return useMemo(() => searchParams.get("type"), [searchParams]);
}
