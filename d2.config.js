/** @type {import('@dhis2/cli-app-scripts').D2Config} */
const config = {
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
	viteConfigExtensions: "./viteConfigExtensions.mts",
};
module.exports = config;
