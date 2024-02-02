import React from "react";
import { useAccess } from "./hooks/access";

export enum AppAccessType {
	PLAN = "Standalone Action Tracker - Planning",
	TRACK = "Standalone Action Tracker - Tracking",
	CONFIGURE = "Standalone Action Tracker - Configure",
}

export interface AccessProviderProps {
	children: React.ReactNode;
	access: AppAccessType;
	shouldHide?: boolean;
	override?: boolean;
	fallback?: React.ReactElement;
}

export function AccessProvider({
	access,
	children,
	shouldHide,
	override,
	fallback,
}: AccessProviderProps) {
	const allowed = useAccess(access);

	if ((!allowed || override) && shouldHide) {
		if (fallback) {
			return fallback;
		}
		return null;
	}
	return React.cloneElement(children as React.ReactElement, {
		disabled: override || !allowed || undefined,
	});
}
