export interface AccessObject {
	id: string;
	access: string;
	displayName: string;
	name: string;
}

export interface SharingObject {
	publicAccess: string;
	externalAccess: boolean;
	user: {
		id: string;
		name: string;
	};
	userAccesses: Array<AccessObject>;
	userGroupAccesses: Array<AccessObject>;
}

export interface MetaObject {
	allowPublicAccess: boolean;
	allowExternalAccess: boolean;
}

export interface SharingPayload {
	meta: MetaObject;
	object: SharingObject;
}
