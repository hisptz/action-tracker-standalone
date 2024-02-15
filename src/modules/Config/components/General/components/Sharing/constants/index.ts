import i18n from "@dhis2/d2-i18n";

export const ACCESS_NONE = {
	value: "--------",
	label: i18n.t("No Access"),
} as const;
export const ACCESS_VIEW_ONLY = {
	value: "r-------",
	label: i18n.t("View Only"),
} as const;
export const ACCESS_VIEW_AND_EDIT = {
	value: "rw------",
	label: i18n.t("View and Edit"),
} as const;

export const ACCESS_TYPES = [
	ACCESS_NONE,
	ACCESS_VIEW_ONLY,
	ACCESS_VIEW_AND_EDIT,
] as const;

export enum AccessEntityType {
	USER = "userAccess",
	USER_GROUP = "userGroupAccess",
	PUBLIC = "publicAccess",
}

export enum SharedTarget {
	EXTERNAL = "SHARE_TARGET_EXTERNAL",
	PUBLIC = "SHARE_TARGET_PUBLIC",
	USER = "SHARE_TARGET_USER",
	GROUP = "SHARE_TARGET_GROUP",
}

export const SHARE_TARGET_EXTERNAL = "SHARE_TARGET_EXTERNAL";
export const SHARE_TARGET_PUBLIC = "SHARE_TARGET_PUBLIC";
export const SHARE_TARGET_USER = "SHARE_TARGET_USER";
export const SHARE_TARGET_GROUP = "SHARE_TARGET_GROUP";
