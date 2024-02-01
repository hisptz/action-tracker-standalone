import { Button } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import React from "react";
import { SharingDialog } from "./components/SharingDialog/SharingDialog";
import "./sharing.css";
import { useBoolean } from "usehooks-ts";

export function Sharing() {
	const {
		value: hide,
		setTrue: onClose,
		setFalse: onOpen,
	} = useBoolean(true);

	return (
		<>
			<div className="column gap-8">
				<span>
					{i18n.t(
						"Configure who can access this configuration and metadata associated",
					)}
				</span>
				<div id="sharing-area">
					<SharingDialog hide={hide} onClose={onClose} />
					<Button onClick={onOpen}>
						{i18n.t("Configure sharing")}
					</Button>
				</div>
			</div>
		</>
	);
}
