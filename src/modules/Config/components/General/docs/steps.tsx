import { Step } from "intro.js-react";
import i18n from "@dhis2/d2-i18n";
import React from "react";

export const GeneralInitialStep: Step = {
	title: i18n.t("General configuration"),
	intro: (
		<div>
			<p>
				{i18n.t(
					"This page allows you to configure basic details of the application. Settings like default dimensions, planning and tracking configuration, and access can be configured here.",
				)}
			</p>
		</div>
	),
};

export const OrgUnitAccessSteps: Step[] = [
	{
		element: "div[data-test='org-unit-access']",
		title: i18n.t("Organisation unit access"),
		intro: (
			<>
				<p>
					{i18n.t(
						"Here you can define the specific organisation units you want to allow planning and tracking.",
					)}
				</p>
				<p>
					{i18n.t(
						"To select an organisation click on the checkbox. You can also click on a checked box to un-select an organisation unit",
					)}
				</p>
			</>
		),
	},
	{
		element: "div[data-test='org-unit-level-access-selector']",
		title: i18n.t("Organisation unit selection by level"),
		intro: (
			<>
				<p>
					{i18n.t(
						"To select all organisation units in a level, choose the level from this selector and click select. To unselect all organisation units in the level click on deselect",
					)}
				</p>
			</>
		),
	},
	{
		element: "div[data-test='org-unit-group-access-selector']",
		title: i18n.t("Organisation unit selection by group"),
		intro: (
			<>
				<p>
					{i18n.t(
						"To select all organisation units in a group, choose the group from this selector and click select. To unselect all organisation units in the group click on deselect",
					)}
				</p>
			</>
		),
	},
	{
		element: "input[placeholder='Search name, id']",
		title: i18n.t("Searching organisation unit"),
		intro: (
			<p>
				{i18n.t(
					"You can also search for a specific organisation unit here",
				)}
			</p>
		),
	},
];

export const OrgUnitPlanningSteps: Step[] = [
	{
		element: "div[data-test='org-unit-planning-config-container']",
		title: i18n.t("Planning organisation unit level configuration"),
		intro: (
			<div>
				<p>
					{i18n.t(
						"Here you can configure planning and tracking to be limited to only some of the organisation unit levels. This means the organisation unit selectors will be limited to only organisation units in this level",
					)}
				</p>
				<p>
					{i18n.t(
						"To enable, click on the checkbox and then select an organisation unit level in the select field",
					)}
				</p>
				<p>
					{i18n.t(
						"To disable this feature. uncheck the checkbox. With the checkbox unchecked, organisation unit selectors will allow selection for all organisation units",
					)}
				</p>
			</div>
		),
	},
];

export const OrgUnitDefaultSteps: Step[] = [
	{
		element: "#org-unit-default-config-field-container",
		title: i18n.t("Default organisation unit"),
		intro: (
			<p>
				{i18n.t(
					"Here you can set the default organisation unit. This will be the pre-selected organisation unit whenever the application starts",
				)}
			</p>
		),
	},
];

export const PeriodSteps: Step[] = [
	{
		element: "#planning-frequency-field-container",
		title: i18n.t("Planning frequency"),
		intro: (
			<div>
				<p>
					{i18n.t(
						"Planning frequency is the frequency at which you expect to plan your activities. When selected period selection will only be limited to periods of the frequency. When creating actions/activities, their start and end dates should be within the selected planning period.",
					)}
				</p>
				<p>
					<b>{i18n.t("Note")}:</b>
					{i18n.t(
						"The planning frequency should be greater or equal to the tracking period.",
					)}
				</p>
			</div>
		),
	},
	{
		element: "#tracking-frequency-field-container",
		title: i18n.t("Tracking frequency"),
		intro: (
			<div>
				<p>
					{i18n.t(
						"Tracking frequency is the frequency at which you expect to track your activities. It controls how frequent you are supposed to provide an activity status. While on tracking mode, this will control the type of periods in the tracking columns.",
					)}
				</p>
				<p>
					<b>{i18n.t("Note")}:</b>
					{i18n.t(
						"The tracking frequency should be less or equal to the planning period.",
					)}
				</p>
			</div>
		),
	},
	{
		element: "#default-period-field-container",
		title: i18n.t("Default period"),
		intro: (
			<p>
				{i18n.t(
					"Here you can set the default period. This will be the pre-selected period whenever the application starts",
				)}
			</p>
		),
	},
	{
		element: "div[data-test='default-period-year-selector']",
		title: i18n.t("Default period"),
		intro: (
			<p>
				{i18n.t("You can change the year for the default period here.")}
			</p>
		),
	},
];

export const SharingSteps: Step[] = [
	{
		element: "#sharing-area",
		title: i18n.t("Sharing and access configuration"),
		intro: (
			<div>
				<p>
					{i18n.t(
						"Here you can configure sharing and access settings for the application. You can define who can view and edit the data. Access can be granted to all users, specific users, or user groups",
					)}
				</p>
			</div>
		),
	},
];
export const SharingDialogSteps: Step[] = [
	{
		element: "#sharing-form-area",
		title: i18n.t("Sharing and access configuration"),
		intro: (
			<div>
				<p>
					{i18n.t(
						"Here you can configure sharing and access settings for the application. You can define who can view and edit the data. Access can be granted to all users, specific users, or user groups",
					)}
				</p>
			</div>
		),
	},
	{
		element: "#search-sharing-settings",
		title: i18n.t("Sharing and access configuration"),
		intro: (
			<div>
				<p>
					{i18n.t(
						"You can search for a user, user role, or user group here. When you type, a list of matching users, user roles or user groups will appear below the field. You can then click on the name to select",
					)}
				</p>
			</div>
		),
	},
	{
		element: "#select-access-sharing-settings",
		title: i18n.t("Sharing and access configuration"),
		intro: (
			<div>
				<p>
					{i18n.t(
						"You can select the appropriate access you want to set for the selected entity",
					)}
				</p>
			</div>
		),
	},
	{
		element: ".access-config-add-user-access-action",
		title: i18n.t("Sharing and access configuration"),
		intro: (
			<div>
				<p>
					{i18n.t(
						"You can then click on give access to add the selection.",
					)}
				</p>
			</div>
		),
	},
	{
		element: ".access-list",
		title: i18n.t("Sharing and access configuration"),
		intro: (
			<div>
				<p>
					{i18n.t("This is a list of already configured accesses.")}
				</p>
			</div>
		),
	},
	{
		element: ".access-list-item.select",
		title: i18n.t("Sharing and access configuration"),
		intro: (
			<div>
				<p>
					{i18n.t("You can modify an existing access setting here.")}
				</p>
			</div>
		),
	},
	{
		element: ".access-lists-access-options-delete-action",
		title: i18n.t("Sharing and access configuration"),
		intro: (
			<div>
				<p>{i18n.t("You can also remove the access setting here")}</p>
			</div>
		),
	},
	{
		element: ".save-access-button",
		title: i18n.t("Sharing and access configuration"),
		intro: (
			<div>
				<p>{i18n.t("Click on save to save the changes")}</p>
			</div>
		),
	},
	{
		element: ".cancel-access-button",
		title: i18n.t("Sharing and access configuration"),
		intro: (
			<div>
				<p>
					{i18n.t(
						"To ignore changes and close the configuration click here",
					)}
				</p>
			</div>
		),
	},
];

export const SaveChanges: Step[] = [
	{
		element: "button[data-test='reset-config-button']",
		title: i18n.t("Reset changes"),
		intro: (
			<p>
				{i18n.t(
					"Click here if you want to redo all changes on all configuration. This will be disabled when there are no changes to redo.",
				)}
			</p>
		),
	},
	{
		element: "button[data-test='save-config-button']",
		title: i18n.t("Save changes"),
		intro: (
			<p>
				{i18n.t(
					"Click here to save all changes done. This will be disabled when there are no changes to save",
				)}
			</p>
		),
	},
];

export const GeneralSteps = [
	GeneralInitialStep,
	...OrgUnitAccessSteps,
	...OrgUnitPlanningSteps,
	...OrgUnitDefaultSteps,
	...PeriodSteps,
	...SaveChanges,
];
