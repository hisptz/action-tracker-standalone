import { useDataQuery } from "@dhis2/app-runtime";
import { useDimensions } from "@/shared/hooks";
import { useEffect, useMemo } from "react";
import { fromPairs, isEmpty } from "lodash";
import { useConfiguration } from "@/shared/hooks/config";
import { Event, TrackedEntity } from "@/shared/types/dhis2";
import { Config } from "@/shared/schemas/config";
import { formatDate } from "@/shared/utils/date";
import { FixedPeriod } from "@dhis2/multi-calendar-dates/build/types/period-calculation/types";

const trackedEntitiesQuery: any = {
	data: {
		resource: "tracker/trackedEntities",
		params: ({ page, pageSize, ou, filter, program }: any) => ({
			page,
			program,
			filter: [filter],
			pageSize,
			orgUnit: ou,
			ouMode: "DESCENDANTS",
			totalPages: true,
			order: "createdAt:asc",
			fields: [
				"trackedEntity",
				"trackedEntityType",
				"orgUnit",
				"attributes[attribute,valueType,value]",
				"enrollments[enrollment,orgUnit,program,enrolledAt,occurredAt,events[dataValues,occurredAt]]",
			],
		}),
	},
};
const eventsQuery: any = {
	data: {
		resource: "tracker/events",
		params: ({ page, pageSize, ou, filter }: any) => ({
			page,
			pageSize,
			filter: [filter],
			orgUnit: ou,
			ouMode: "DESCENDANTS",
			totalPages: true,
			order: "createdAt:asc",
			fields: [
				"event",
				"enrollment",
				"occurredAt",
				"orgUnit",
				"program",
				"programStage",
				"dataValues[dataElement,valueType,value]",
			],
		}),
	},
};

interface Response {
	data: {
		instances: Array<Event> | Array<TrackedEntity>;
		trackedEntities?: Array<TrackedEntity>;
		events?: Array<Event>;
		pager?: {
			page: number;
			pageSize: number;
			total: number;
			pageCount: number;
		};
		page?: number;
		pageSize?: number;
		total?: number;
	};
}

export function getPeriodQuery(config: Config, period?: FixedPeriod) {
	if (!period) {
		return [];
	}
	const startDateId = config.action.fields.find(
		({ isStartDate }) => isStartDate,
	)?.id;
	const endDateId = config.action.fields.find(
		({ isEndDate }) => isEndDate,
	)?.id;

	const { startDate, endDate } = period;
	return [`${startDateId}:GE:${startDate}`, `${endDateId}:LE:${endDate}`];
}

export function useTableData(
	type: "program" | "programStage",
	{
		parentInstance,
		parentType,
	}: {
		parentInstance: any;
		parentType: "program" | "programStage";
	},
) {
	const { config } = useConfiguration();
	const { orgUnit, period } = useDimensions();
	const { data, refetch, loading, error } = useDataQuery<Response>(
		type === "program" ? trackedEntitiesQuery : eventsQuery,
		{
			variables: {
				program: type === "program" ? config?.action.id : undefined,
				ou: orgUnit?.id,
				page: 1,
				pageSize: 10,
				filter: [
					`${type === "program" ? config?.meta.linkageConfig.trackedEntityAttribute : config?.meta.linkageConfig.dataElement}:eq:${parentType === "program" ? parentInstance?.trackedEntity : parentInstance?.event}`,
					...(type === "program"
						? getPeriodQuery(config as Config, period)
						: []),
				],
			},
		},
	);

	const rawData = useMemo(() => {
		return (
			data?.data?.instances ??
			data?.data?.events ??
			data?.data?.trackedEntities ??
			[]
		);
	}, [data]);

	const rows = useMemo(() => {
		return rawData?.map((instance) => {
			const data =
				type === "program"
					? (instance as TrackedEntity).attributes
					: (instance as Event).dataValues;

			return {
				...fromPairs(
					data?.map((item: any) => {
						const valueType = item.valueType;
						let value = item.value;

						if (valueType === "DATE") {
							value = formatDate(value);
						}
						return [item.attribute ?? item.dataElement, value];
					}),
				),
				instance,
			} as Record<string, any>;
		});
	}, [rawData]);

	const noData = useMemo(() => isEmpty(rawData), [rawData]);

	const pagination = useMemo(() => {
		const pageSize =
			data?.data?.pageSize ?? data?.data.pager?.pageSize ?? 10;
		const total = data?.data?.total ?? data?.data.pager?.total ?? 1;
		const page = data?.data?.page ?? data?.data.pager?.page ?? 1;
		const pageCount =
			data?.data?.pager?.pageCount ??
			Math.ceil((total ?? 1) / (pageSize ?? 1));
		return {
			page,
			pageSize,
			total,
			pageCount,
			onPageChange: (page: number) => {
				refetch({
					page,
				});
			},
			onPageSizeChange: (pageSize: number) => {
				refetch({
					pageSize,
					page: 1,
				});
			},
		};
	}, [data, refetch]);

	useEffect(() => {
		if (type === "program") {
			refetch({
				filter: [
					`${type === "program" ? config?.meta.linkageConfig.trackedEntityAttribute : config?.meta.linkageConfig.dataElement}:eq:${parentType === "program" ? parentInstance?.trackedEntity : parentInstance?.event}`,
					...(type === "program"
						? getPeriodQuery(config as Config, period)
						: []),
				],
			});
		}
	}, [period]);

	return {
		loading,
		noData,
		refetch,
		error,
		rows,
		pagination,
	};
}
