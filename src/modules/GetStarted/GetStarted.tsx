import React from "react";
import i18n from "@dhis2/d2-i18n";
import appLogo from "../../shared/assets/images/app-logo.png";
import TemplateCard from "./components/TemplateCard/TemplateCard";
import { configTemplates } from "../../shared/constants/templates";
import {
	AccessProvider,
	AppAccessType,
} from "../../shared/components/AccessProvider";

export function GetStarted() {
	return (
		<div className="column align-center center w-100 h-100 gap-16">
			<img alt={i18n.t("app logo")} width={100} src={appLogo} />
			<h1 className="m-0">
				{i18n.t("Welcome to the Standalone Action Tracker")}
			</h1>
			<AccessProvider
				shouldHide
				fallback={
					<div className="column gap-8 align-center text-center">
						<span>
							{i18n.t(
								"There are currently no configuration in this instance and you do not have configuration access. Please communicate with your administrator for the necessary access.",
							)}
						</span>
						<span>
							{i18n.t(
								"If you are the administrator, make sure you have the necessary authority to configure the standalone action tracker. Configuration of the authorities is done in the users app.",
							)}
						</span>
					</div>
				}
				access={AppAccessType.CONFIGURE}
			>
				<>
					<span>
						{i18n.t(
							"How would you like to use your action tracker?",
						)}
					</span>

					<div
						style={{ flexWrap: "wrap" }}
						className="row gap-32 center"
					>
						{configTemplates.map((template) => (
							<TemplateCard
								key={`${template.title}-card`}
								template={template}
							/>
						))}
					</div>
				</>
			</AccessProvider>
		</div>
	);
}
