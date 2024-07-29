import { useConfig } from "@dhis2/app-runtime";
import { SupportedCalendar } from "@dhis2/multi-calendar-dates/build/types/types";

export function useCalendar() {
	const { systemInfo } = useConfig();

	return (
		(
			systemInfo as unknown as {
				calendar: SupportedCalendar;
			}
		).calendar ?? "gregory"
	);
}
