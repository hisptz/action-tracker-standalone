import React from "react";
import i18n from "@dhis2/d2-i18n";
import {Divider} from "@dhis2/ui";
import {RHFTextInputField} from "@hisptz/dhis2-ui";
import {ActionFields} from "./components/ActionFields";

const namespace = `action`

export function Actions() {

		return (
				<div className="column gap-32">
						<div>
								<h2 className="m-0">{i18n.t("Action Configuration")}</h2>
								<Divider margin="0"/>
						</div>
						<div style={{maxWidth: 800}} className="flex-1  column gap-16">
								<div className="column gap-16">
										<h3 className="m-0">{i18n.t("Action")}</h3>
										<RHFTextInputField
												required
												validations={{
														required: i18n.t("Name is required")
												}}
												helpText={i18n.t("This will appear on headings and button labels")}
												name={`${namespace}.name`} label={i18n.t("Name")}
										/>
										<ActionFields/>
								</div>
						</div>
				</div>
		)
}
