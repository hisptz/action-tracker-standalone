import { useDimensions } from "@/shared/hooks";
import { useConfiguration } from "@/shared/hooks/config";
import { useMetadata } from "@/shared/hooks/metadata";
import { useCallback, useEffect, useMemo } from "react";
import { find, head } from "lodash";
import { useAlert, useDataQuery } from "@dhis2/app-runtime";
import { TrackedEntity } from "@/shared/types/dhis2";

const dataQuery: any = {
	data: {
		resource: "tracker/trackedEntities",
		params: ({
			program,
			orgUnit,
			pageSize,
			page,
		}: {
			program: string;
			orgUnit: string;
			trackedEntityType: string;
			pageSize: number;
			page: number;
		}) => {
			return {
				program,
				page,
				pageSize,
				orgUnit,
				fields: [
					"trackedEntity",
					"trackedEntityType",
					"orgUnit",
					"attributes[attribute,value,valueType]",
					"enrollments[enrollment,orgUnit,enrolledAt,occurredAt,program]",
				],
			};
		},
	},
};

interface Response {
	data: {
		instances?: TrackedEntity[];
		trackedEntities?: TrackedEntity[];
		page: number;
		pageSize: number;
		total: number;
		pager?: {
			page: number;
			pageSize: number;
			total: number;
			pageCount: number;
		};
	};
}

export function useCategoryData() {
	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({
			...type,
			duration: 3000,
		}),
	);

	const { orgUnit } = useDimensions();
	const { config } = useConfiguration();
	const { programs } = useMetadata();
	const initialCategory = useMemo(() => {
		if (config != null) {
			return head(config.categories) ?? config.action;
		}
	}, [config]);

	const { data, refetch, loading, error } = useDataQuery<Response>(
		dataQuery,
		{
			variables: {
				program: initialCategory?.id,
				trackedEntityType: find(programs, ["id", initialCategory?.id])
					?.trackedEntityType?.id,
				orgUnit: orgUnit?.id,
				page: 1,
				pageSize: 5,
			},
			lazy: true,
			onError: (error) => {
				show({
					message: error.message,
					type: { critical: true },
				});
			},
		},
	);

	const pagination = useMemo(() => {
		if (data != null) {
			const page = data.data.page ?? data.data.pager?.page;
			const pageSize = data.data.pageSize ?? data.data.pager?.pageSize;
			const total = data.data.total ?? data.data.pager?.total;
			const pageCount =
				data.data.pager?.pageCount ?? Math.ceil(total / pageSize);

			return {
				page,
				pageSize,
				total,
				pageCount,
			};
		} else {
			return {
				page: 0,
				pageSize: 0,
				total: 0,
			};
		}
	}, [data]);

	const onPageChange = useCallback(
		(page: number) => {
			refetch({
				page,
			}).catch(console.error);
		},
		[refetch],
	);

	const onPageSizeChange = useCallback(
		(pageSize: number) => {
			refetch({
				pageSize,
			}).catch(console.error);
		},
		[refetch],
	);

	const categoryData = useMemo(() => {
		if (data != null) {
			return data.data.instances ?? data?.data?.trackedEntities ?? [];
		} else {
			return [];
		}
	}, [data]);

	useEffect(() => {
		if (orgUnit) {
			refetch({
				orgUnit: orgUnit?.id,
			}).catch(console.error);
		}
	}, [orgUnit?.id, refetch]);

	return {
		error,
		loading,
		refetch,
		categoryData,
		category: initialCategory,
		onPageChange,
		onPageSizeChange,
		...pagination,
	};
}
