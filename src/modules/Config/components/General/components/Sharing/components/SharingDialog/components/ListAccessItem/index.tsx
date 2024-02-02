import {
	Button,
	Divider,
	IconDelete24,
	SingleSelectField,
	SingleSelectOption,
} from "@dhis2/ui";
import React from "react";
import ListItemIcon from "../ListAccessItemIcon";
import ListItemContext from "../ListItemContext";
import "./ListAccessItem.css";

import i18n from "@dhis2/d2-i18n";
import { ACCESS_TYPES, SharedTarget } from "../../../../constants";
import { AccessObject } from "../../../../types/data";
import { find } from "lodash";

export function ListItem({
	entity,
	target,
	onChange,
	onRemove,
}: {
	entity: AccessObject;
	target: SharedTarget;
	onChange: (value: { id: string; access: string }) => void;
	onRemove?: (id: string) => void;
}) {
	const accessOptions = ACCESS_TYPES;
	const { name, access, id } = entity;

	const accessLabel = find(ACCESS_TYPES, ["value", access])?.label;
	return (
		<>
			<div className="wrapper">
				<div className="details access-list-item">
					<div className="details-logo">
						<ListItemIcon
							target={target}
							name={
								name ??
								entity?.name ??
								entity?.displayName ??
								""
							}
						/>
					</div>
					<div className="details-text">
						<p className="details-name">
							{name ?? entity?.name ?? entity?.displayName ?? ""}
						</p>
						<ListItemContext access={accessLabel} />
					</div>
				</div>
				<div className="select access-list-item">
					<div className="flex-1 access-lists-access-options">
						<SingleSelectField
							selected={access}
							onChange={({ selected }: { selected: string }) =>
								onChange({
									id,
									access: selected,
								})
							}
						>
							{accessOptions?.map(({ value, label }) => (
								<SingleSelectOption
									key={value}
									label={label}
									value={value}
									active={value === access}
								/>
							))}
						</SingleSelectField>
					</div>
					{onRemove && (
						<Button
							className={
								"access-lists-access-options-delete-action"
							}
							onClick={() => onRemove(id)}
							icon={<IconDelete24 />}
						>
							{i18n.t("Delete")}
						</Button>
					)}
				</div>
			</div>
			<Divider />
		</>
	);
}
