import i18n from "@dhis2/d2-i18n";
import React from "react";
import {
	ACCESS_TYPES,
	AccessEntityType,
	SharedTarget,
} from "../../../constants";
import Title from "./Title";
import { ListItem } from "./ListAccessItem";
import useManageAccess from "../hooks";

export function AccessList(): React.ReactElement {
	const {
		userGroupAccess,
		userAccess,
		onChangeAccess,
		onRemove,
		publicAccess,
	} = useManageAccess();

	return (
		<>
			<Title
				title={i18n.t("Users and groups that currently have access")}
			/>
			<div className="header">
				<div className="header-left-column">
					{i18n.t("User / Group / Role")}
				</div>
				<div className="header-right-column">
					{i18n.t("Access level")}
				</div>
			</div>
			<div className="access-list">
				<ListItem
					entity={{
						name: i18n.t("All users"),
						displayName: i18n.t("All users"),
						id: "allUsers",
						access: publicAccess,
					}}
					target={SharedTarget.PUBLIC}
					accessOptions={ACCESS_TYPES}
					onChange={onChangeAccess(AccessEntityType.PUBLIC)}
					onRemove={onRemove(AccessEntityType.PUBLIC)}
				/>
				{userGroupAccess?.map((uGroup) => (
					<ListItem
						entity={uGroup}
						target={SharedTarget.GROUP}
						accessOptions={ACCESS_TYPES}
						onChange={onChangeAccess(AccessEntityType.USER_GROUP)}
						onRemove={onRemove(AccessEntityType.USER_GROUP)}
					/>
				))}
				{userAccess?.map((entity) => (
					<ListItem
						entity={entity}
						key={entity.id}
						target={SharedTarget.USER}
						accessOptions={ACCESS_TYPES}
						onChange={onChangeAccess(AccessEntityType.USER)}
						onRemove={onRemove(AccessEntityType.USER)}
					/>
				))}
			</div>
		</>
	);
}
