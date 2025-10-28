/** @type {import('@dhis2/cli-app-scripts').D2Config} */
const config = {
	id: "0efc14dc-bf0b-474d-8a02-82c27d891b23",
	type: "app",
	title: "Standalone Action Tracker",
	entryPoints: {
		app: "./src/App.tsx",
	},
	dataStoreNamespace: "hisptz-standalone-action-tracker",
	customAuthorities: [
		"Standalone Action Tracker - Planning",
		"Standalone Action Tracker - Tracking",
		"Standalone Action Tracker - Configure",
	],
	minDHIS2Version: "2.40",
	maxDHIS2Version: "2.42",
	viteConfigExtensions: "./viteConfigExtensions.mts",
};
module.exports = config;
