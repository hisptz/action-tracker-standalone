import { useController } from "react-hook-form";
import React, { useRef, useState } from "react";
import { uniqBy } from "lodash";
import Title from "./Title";
import i18n from "@dhis2/d2-i18n";
import { SharingAutoComplete } from "./SharingAutocomplete";
import {
	Button,
	colors,
	SingleSelectField,
	SingleSelectOption,
} from "@dhis2/ui";
import { ACCESS_TYPES } from "../../../constants";

export function AccessAdd(): React.ReactElement {
	const { field: userAccessField } = useController({ name: "userAccesses" });
	const { field: userGroupAccessField } = useController({
		name: "userGroupAccesses",
	});
	const ref = useRef<HTMLFormElement>(null);
	const [entity, setEntity] = useState<
		| { id: string; type: string; name?: string; displayName?: string }
		| undefined
	>();
	const [access, setAccess] = useState("");
	const onSubmit = (e: { preventDefault: () => void }) => {
		e.preventDefault();
		if (entity?.type === "user") {
			userAccessField.onChange(
				uniqBy(
					[
						...userAccessField.value,
						{
							...entity,
							access,
						},
					],
					"id",
				),
			);
		}
		if (entity?.type === "userGroup") {
			userGroupAccessField.onChange(
				uniqBy(
					[
						...userGroupAccessField.value,
						{
							...entity,
							access,
						},
					],
					"id",
				),
			);
		}
		setEntity(undefined);
		setAccess("");
	};

	return (
		<div className="access-config-add-user">
			<Title title={i18n.t("Give Access to a user , group or role")} />
			<form
				ref={ref}
				style={{
					display: "flex",
					gap: 16,
				}}
				onSubmit={onSubmit}
			>
				<div className="flex-1 access-config-add-user-search">
					<SharingAutoComplete
						selected={entity}
						onSelection={setEntity}
					/>
				</div>
				<div className="select-wrapper access-config-add-user-select-wrapper">
					<SingleSelectField
						label={i18n.t("Access level")}
						placeholder={i18n.t("Select a level")}
						dataTest={"access-level-list-test"}
						selected={access}
						onChange={({ selected }: any) => setAccess(selected)}
					>
						{ACCESS_TYPES.map(({ value, label }) => (
							<SingleSelectOption
								dataTest={"access-level-option-list-test"}
								key={value}
								label={label}
								value={value}
								active={value === access}
							/>
						))}
					</SingleSelectField>
				</div>
				<Button
					className={"access-config-add-user-access-action"}
					type="submit"
					disabled={!entity || !access}
				>
					{i18n.t("Give access")}
				</Button>
			</form>
			<style>{`
        form {
          background-color: ${colors.grey100};
          color: ${colors.grey900};
          margin-bottom: 21px;
          padding: 8px 12px;
          border-radius: 5px;
          display: flex;
          align-items: flex-end;
        }

        .select-wrapper {
          flex: 1;
        }
      `}</style>
		</div>
	);
}
