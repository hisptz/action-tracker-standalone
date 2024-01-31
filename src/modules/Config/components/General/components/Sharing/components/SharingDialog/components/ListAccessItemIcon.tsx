import { colors, IconUserGroup24, IconWorld24, UserAvatar } from "@dhis2/ui";
import React from "react";
import {
	SHARE_TARGET_EXTERNAL,
	SHARE_TARGET_GROUP,
	SHARE_TARGET_PUBLIC,
	SHARE_TARGET_USER,
} from "../../../constants";

export default function ListItemIcon({
	target,
	name,
}: {
	target: string;
	name: string;
}) {
	switch (target) {
		case SHARE_TARGET_EXTERNAL:
			return <IconWorld24 color={colors.grey600} />;
		case SHARE_TARGET_PUBLIC:
		case SHARE_TARGET_GROUP:
			return <IconUserGroup24 color={colors.grey600} />;
		case SHARE_TARGET_USER:
			return <UserAvatar name={name} small />;
		default:
			return null;
	}
}
