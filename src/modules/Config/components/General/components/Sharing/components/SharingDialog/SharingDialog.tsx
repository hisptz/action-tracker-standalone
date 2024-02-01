import React, { useEffect } from "react";
import { useAlert, useDataMutation } from "@dhis2/app-runtime";
import { useConfiguration } from "../../../../../../../../shared/hooks/config";
import {
	Button,
	ButtonStrip,
	Modal,
	ModalActions,
	ModalContent,
} from "@dhis2/ui";
import { SharingObject } from "../../types/data";
import { FormProvider, useForm } from "react-hook-form";
import { AccessAdd } from "./components/AccessAdd";
import { AccessList } from "./components/AccessList";
import i18n from "@dhis2/d2-i18n";
import { getSharableItems } from "../../utils";
import { some } from "lodash";
import { useRecoilValue } from "recoil";
import { ConfigAccessState } from "../../../../../../../../shared/state/config";

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

	const defaultAccessData = useRecoilValue(ConfigAccessState(config?.id));

	const form = useForm<SharingObject>({});

	useEffect(() => {
		if (defaultAccessData) {
			form.reset(defaultAccessData.object ?? {});
		}
	}, [defaultAccessData]);

	const [save] = useDataMutation(accessMutation);

	const onSaveChanges = async (data: SharingObject) => {
		if (!config) return;
		try {
			const sharableItems = getSharableItems(config);
			const accessResponse = await Promise.all([
				...sharableItems.map((item) =>
					save({
						data: {
							...defaultAccessData,
							object: data,
						},
						...item,
					}),
				),
				save({
					type: "dataStore",
					id: defaultAccessData?.object?.id,
					data: {
						...defaultAccessData,
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

	const isSaving = form.formState.isSubmitting || form.formState.isValidating;

	return (
		<Modal position="middle" hide={hide} onClose={onClose}>
			<ModalContent>
				<FormProvider {...form}>
					<div className="column  gap-8">
						<AccessAdd />
						<AccessList />
					</div>
				</FormProvider>
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
