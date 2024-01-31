import React, { useEffect } from "react";
import { DATASTORE_NAMESPACE } from "../../../../../../../../shared/constants/meta";
import { useDataQuery } from "@dhis2/app-runtime";
import { useConfiguration } from "../../../../../../../../shared/hooks/config";
import { CircularLoader } from "@dhis2/ui";
import { SharingObject, SharingPayload } from "../../types/data";
import { FormProvider, useForm } from "react-hook-form";
import { AccessAdd } from "./components/AccessAdd";
import { AccessList } from "./components/AccessList";

const metaQuery: any = {
	meta: {
		resource: `dataStore/${DATASTORE_NAMESPACE}`,
		id: ({ id }: { id: string }) => `${id}/metaData`,
	},
};

interface MetaQueryResponse {
	meta: {
		id: string;
		key: string;
		namespace: string;
	};
}

const sharingQuery: any = {
	data: {
		resource: "sharing",
		params: ({ id }: { id: string }) => ({
			type: "dataStore",
			id,
		}),
	},
};

interface SharingQueryResponse {
	data: SharingPayload;
}

const accessMutation: any = {
	type: "update",
	resource: "sharing",
	data: ({ data }: any) => data,
	params: ({ type, id }: any) => {
		return {
			type,
			id,
		};
	},
};

export function SharingDialog() {
	const { config } = useConfiguration();
	const { data: metaData, loading: metaLoading } =
		useDataQuery<MetaQueryResponse>(metaQuery, {
			variables: {
				id: config?.id,
			},
		});

	const {
		data: sharingData,
		refetch,
		loading: sharingLoading,
	} = useDataQuery<SharingQueryResponse>(sharingQuery, {
		lazy: true,
	});
	const form = useForm<SharingObject>({});

	useEffect(() => {
		async function get() {
			if (metaData) {
				const response = (await refetch({
					id: metaData.meta.id,
				})) as unknown as SharingQueryResponse;

				form.reset({
					...response?.data.object,
				});
			}
		}

		get();
	}, [metaData]);

	const loading = metaLoading || sharingLoading;
	if (loading) {
		return (
			<div className="w-100 h-100 column center align-center">
				<CircularLoader small />
			</div>
		);
	}

	return (
		<FormProvider {...form}>
			<div className="column  gap-8">
				<AccessAdd />
				<AccessList />
			</div>
		</FormProvider>
	);
}
