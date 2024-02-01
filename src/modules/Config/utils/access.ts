import { User } from "../../../shared/types/dhis2";
import { SharingPayload } from "../components/General/components/Sharing/types/data";
import { intersectionBy, isEmpty } from "lodash";
import { ACCESS_TYPES } from "../components/General/components/Sharing/constants";

export function userHasAccess({
	user,
	accessConfig,
	access,
}: {
	user: User;
	accessConfig?: SharingPayload | null;
	access: (typeof ACCESS_TYPES)[number];
}) {
	if (!accessConfig) {
		return false;
	}
	const userId = user.id;

	if (accessConfig.object.user.id === userId) {
		return true;
	}
	const userAccess = accessConfig.object.userAccesses.find(
		({ id }) => id === userId,
	);

	if (userAccess) {
		if (userAccess.access.match(access.value)) {
			/* This is done under the assumption the entities can only be in 3 modes */
			return true;
		}
	}
	const userGroups = intersectionBy(
		accessConfig.object.userGroupAccesses,
		user.userGroups,
		"id",
	);
	if (!isEmpty(userGroups)) {
		return userGroups.some((group) => group.access.match(access.value));
	}

	return false;
}
