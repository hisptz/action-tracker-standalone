import React, { useEffect } from "react";
import { DATASTORE_NAMESPACE } from "../../../../../../../../shared/constants/meta";
import { useAlert, useDataMutation, useDataQuery } from "@dhis2/app-runtime";
import { useConfiguration } from "../../../../../../../../shared/hooks/config";
import {
	Button,
	ButtonStrip,
	CircularLoader,
	Modal,
	ModalActions,
	ModalContent,
} from "@dhis2/ui";
import { SharingObject, SharingPayload } from "../../types/data";
import { FormProvider, useForm } from "react-hook-form";
import { AccessAdd } from "./components/AccessAdd";
import { AccessList } from "./components/AccessList";
import i18n from "@dhis2/d2-i18n";
import { getSharableItems } from "../../utils";
import { some } from "lodash";

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

interface SharingDialogProps {
	hide: boolean;

	onClose(): void;
}

export function SharingDialog({ hide, onClose }: SharingDialogProps) {
	const { config } = useConfiguration();
	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({
			...type,
			duration: 3000,
		}),
	);
	const { data: metaData, loading: metaLoading } =
		useDataQuery<MetaQueryResponse>(metaQuery, {
			variables: {
				id: config?.id,
			},
		});

	const {
		data: defaultAccessData,
		refetch,
		loading: sharingLoading,
	} = useDataQuery<SharingQueryResponse>(sharingQuery, {
		lazy: true,
	});
	const form = useForm<SharingObject>({});

	const [save, { loading: saving }] = useDataMutation(accessMutation);

	const onSaveChanges = async (data: SharingObject) => {
		if (!config) return;
		try {
			const sharableItems = getSharableItems(config);
			const accessResponse = await Promise.all([
				...sharableItems.map((item) =>
					save({
						data: {
							...defaultAccessData?.data,
							object: data,
						},
						...item,
					}),
				),
				save({
					type: "dataStore",
					id: metaData?.meta.id,
					data: {
						...defaultAccessData?.data,
						object: data,
					},
				}),
			]);

			if (
				!some(
					accessResponse,
					(res: { httpStatusCode: number }) =>
						res.httpStatusCode != 200,
				)
			) {
				show({
					message: i18n.t("Sharing configured successfully"),
					type: { success: true },
				});
				onClose();
			} else {
				show({
					message: i18n.t("Sharing configuration failed"),
					type: { critical: true },
				});
			}
		} catch (e: any) {
			show({
				message: `${i18n.t("Sharing configuration failed")}: ${e.message}`,
				type: { critical: true },
			});
		}
	};

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

	const isSaving = form.formState.isSubmitting || form.formState.isValidating;

	return (
		<Modal position="middle" hide={hide} onClose={onClose}>
			<ModalContent>
				{loading ? (
					<div
						style={{ minHeight: 400 }}
						className="w-100 h-100 column center align-center"
					>
						<CircularLoader small />
					</div>
				) : (
					<FormProvider {...form}>
						<div className="column  gap-8">
							<AccessAdd />
							<AccessList />
						</div>
					</FormProvider>
				)}
			</ModalContent>
			<ModalActions>
				<ButtonStrip>
					<Button onClick={onClose}>{i18n.t("Cancel")}</Button>
					<Button
						loading={isSaving}
						onClick={() => form.handleSubmit(onSaveChanges)()}
						primary
					>
						{isSaving ? i18n.t("Saving...") : i18n.t("Save")}
					</Button>
				</ButtonStrip>
			</ModalActions>
		</Modal>
	);
}