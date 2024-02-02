import { useController } from "react-hook-form";
import { useMemo } from "react";
import { cloneDeep, find, findIndex, has, set } from "lodash";
import { ACCESS_TYPES } from "../../../constants";
import i18n from "@dhis2/d2-i18n";
import { useDialog } from "@hisptz/dhis2-ui";
import { SharingObject } from "../../../types/data";

export default function useManageAccess(): {
	publicAccess: string;
	allUserAccess?: { label: string; value: string };
	userGroupAccess: SharingObject["userGroupAccesses"];
	userAccess: SharingObject["userAccesses"];
	onChangeAccess: (
		type: string,
	) => (access: { id: string; access: string }) => void;
	onRemove: (type: string) => (id: string) => void;
} {
	const { confirm } = useDialog();
	const { field: publicAccessField } = useController<
		SharingObject,
		"publicAccess"
	>({
		name: "publicAccess",
	});
	const { field: userGroupAccessField } = useController<
		SharingObject,
		"userGroupAccesses"
	>({
		name: "userGroupAccesses",
	});
	const { field: userAccessField } = useController<
		SharingObject,
		"userAccesses"
	>({
		name: "userAccesses",
	});

	const allUserAccess = useMemo(
		() => find(ACCESS_TYPES, ["value", publicAccessField.value]),
		[publicAccessField],
	);

	const onChangeAccess =
		(type: string) => (access: { id: string; access: string }) => {
			if (type === "publicAccess") {
				publicAccessField.onChange(access.access);
				return;
			}
			if (type === "userAccess") {
				if (has(access, "id")) {
					const newState = cloneDeep(userAccessField.value);
					const updatedUserGroupIndex = findIndex(newState, [
						"id",
						access.id,
					]);
					if (newState[updatedUserGroupIndex]) {
						set(
							newState[updatedUserGroupIndex],
							"access",
							access.access,
						);
					}
					userAccessField.onChange(newState);
				}
				return;
			}
			if (type === "userGroupAccess") {
				if (has(access, "id")) {
					const newState = cloneDeep(userGroupAccessField.value);
					const updatedUserGroupIndex = findIndex(newState, [
						"id",
						access.id,
					]);
					if (newState[updatedUserGroupIndex]) {
						set(
							newState[updatedUserGroupIndex],
							"access",
							access.access,
						);
					}
					userGroupAccessField.onChange(newState);
				}
				return;
			}
		};

	const onRemove = (type: string) => (id: string) => {
		confirm({
			title: i18n.t("Confirm action"),
			message: i18n.t("Are you sure you want to delete this access?"),
			onConfirm: () => {
				if (type === "publicAccess") {
					return;
				}
				if (type === "userAccess") {
					const newState = cloneDeep(userAccessField.value);
					const updatedUserGroupIndex = findIndex(newState, [
						"id",
						id,
					]);
					if (newState[updatedUserGroupIndex]) {
						newState.splice(updatedUserGroupIndex, 1);
					}
					userAccessField.onChange(newState);
				}

				if (type === "userGroupAccess") {
					const newState = cloneDeep(userGroupAccessField.value);
					const updatedUserGroupIndex = findIndex(newState, [
						"id",
						id,
					]);
					if (newState[updatedUserGroupIndex]) {
						newState.splice(updatedUserGroupIndex, 1);
					}
					userGroupAccessField.onChange(newState);
				}
			},
		});
	};

	return {
		publicAccess: publicAccessField.value,
		allUserAccess,
		userGroupAccess: userGroupAccessField.value,
		userAccess: userAccessField.value,
		onChangeAccess,
		onRemove,
	};
}
