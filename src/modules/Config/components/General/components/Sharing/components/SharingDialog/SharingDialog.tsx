import React, { useEffect } from "react";
import { useAlert, useDataMutation } from "@dhis2/app-runtime";
import { useConfiguration } from "../../../../../../../../shared/hooks/config";
import {
	Button,
	ButtonStrip,
	Modal,
	ModalActions,
	ModalContent,
	ModalTitle,
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
import { HelpIcon } from "../../../../../../../../shared/components/HelpButton";
import { SharingDialogSteps } from "../../../../docs/steps";

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
			<ModalTitle>
				{/*@ts-ignore*/ ""}
				<div className="row gap-8">
					{i18n.t("Access and Sharing")}
					<HelpIcon
						steps={SharingDialogSteps}
						key="new-data-item-steps"
					/>
				</div>
			</ModalTitle>
			<ModalContent>
				<FormProvider {...form}>
					<div id="sharing-form-area" className="column  gap-8">
						<AccessAdd />
						<AccessList />
					</div>
				</FormProvider>
			</ModalContent>
			<ModalActions>
				<ButtonStrip>
					<Button className="cancel-access-button" onClick={onClose}>
						{i18n.t("Cancel")}
					</Button>
					<Button
						className="save-access-button"
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
