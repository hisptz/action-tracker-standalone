import React from "react";
import i18n from "@dhis2/d2-i18n";
import { Divider } from "@dhis2/ui";
import { OrganisationUnitConfig } from "./components/OrganisationUnitConfig";
import { PeriodConfig } from "./components/PeriodConfig";
import { GeneralSteps, PeriodSteps, SharingSteps } from "./docs/steps";
import { HelpButton, HelpIcon } from "../../../../shared/components/HelpButton";
import { DeleteConfig } from "./components/DeleteConfig";
import { Sharing } from "./components/Sharing/Sharing";
import { DialogProvider } from "@hisptz/dhis2-ui";

//The dialog context wrapping this component is for accessing url params within the dialog
export function General() {
	return (
		<DialogProvider>
			<div className="column gap-32">
				<div>
					<div className="row space-between gap-16">
						<h2 className="m-0">
							{i18n.t("General configuration")}
						</h2>
						<HelpButton steps={GeneralSteps} key="general-config" />
					</div>
					<Divider margin="0" />
				</div>
				<div style={{ maxWidth: 800 }} className="column gap-32">
					<div className="gap-16 column">
						<h3 className="m-0">{i18n.t("Organisation Units")}</h3>
						<OrganisationUnitConfig />
						<div className="row gap-8 align-center">
							<h3 className="m-0">{i18n.t("Period")}</h3>
							<HelpIcon
								steps={PeriodSteps}
								key="period-config-steps"
							/>
						</div>
						<PeriodConfig />
					</div>
					<div className="row gap-8 align-center">
						<h3 className="m-0">{i18n.t("Access and Sharing")}</h3>
						<HelpIcon
							steps={SharingSteps}
							key="period-config-steps"
						/>
					</div>
					<div>
						<Sharing />
					</div>
					<div className="row gap-8 align-center">
						<h3 className="m-0">
							{i18n.t("Configuration Management")}
						</h3>
					</div>
					<div>
						<DeleteConfig />
					</div>
				</div>
			</div>
		</DialogProvider>
	);
}
