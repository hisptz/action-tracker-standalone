import React from "react";
import { Button } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import { useDialog } from "@hisptz/dhis2-ui";
import { useConfiguration } from "../../../../../shared/hooks/config";
import { useUpdateMetadata } from "../../../../../shared/hooks/metadata";
import { useAlert, useDataMutation } from "@dhis2/app-runtime";
import { useNavigate } from "react-router-dom";
import { DATASTORE_NAMESPACE } from "../../../../../shared/constants/meta";

const deleteMutation: any = {
	resource: `dataStore/${DATASTORE_NAMESPACE}`,
	id: ({ id }: { id: string }) => id,
	type: "delete",
};

export function useDeleteConfig() {
	const navigate = useNavigate();
	const { config } = useConfiguration();
	const { show } = useAlert(
		({ message }) => message,
		({ type }) => ({
			...type,
			duration: 3000,
		}),
	);
	const { deleteMetadataFromConfig } = useUpdateMetadata();
	const [deleteConfig] = useDataMutation(deleteMutation, {
		variables: {
			id: config?.id,
		},
	});

	const onDelete = async () => {
		try {
			if (config) {
				const response = await deleteMetadataFromConfig(config);
				if (response) {
					await deleteConfig();
					show({
						message: i18n.t("Configuration deleted successfully"),
						type: { success: true },
					});
					navigate("/getting-started", { replace: true });
				} else {
				}
			}
		} catch (e: any) {
			show({
				message: `${i18n.t("Could not delete configuration")}: ${e.message}`,
				type: { critical: true },
			});
		}
	};
	return {
		onDelete,
	};
}

export function DeleteConfig() {
	const { confirm } = useDialog();
	const { onDelete } = useDeleteConfig();

	return (
		<div className="column gap-8">
			<div>
				<Button
					onClick={() => {
						confirm({
							title: i18n.t("Delete configuration"),
							message: i18n.t(
								"Are you sure you want to delete this configuration?",
							),
							onCancel: () => {},
							onConfirm: onDelete,
							confirmButtonText: i18n.t("Delete"),
						});
					}}
					destructive
				>
					{i18n.t("Delete configuration")}
				</Button>
			</div>
			<span>
				{i18n.t(
					"Make sure there are no data associated with this configuration before deleting it.",
				)}
			</span>
		</div>
	);
}
