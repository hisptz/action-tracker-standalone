import React, { useEffect } from "react";
import { SideMenu } from "./components/SideMenu";
import { Outlet } from "react-router-dom";
import { useConfiguration } from "../../shared/hooks/config";
import { FormProvider, useForm } from "react-hook-form";
import { Config } from "../../shared/schemas/config";
import { SaveArea } from "./components/SaveArea";
import { useRecoilValue } from "recoil";
import { ConfigAccessState } from "../../shared/state/config";
import { UserState } from "../../shared/state/user";
import { userHasAccess } from "./utils/access";
import { ACCESS_VIEW_AND_EDIT } from "./components/General/components/Sharing/constants";
import { CustomError } from "../../shared/models/error";
import i18n from "@dhis2/d2-i18n";
import { IconBlock24 } from "@dhis2/ui";
import { useAccess } from "../../shared/components/AccessProvider/hooks/access";
import { AppAccessType } from "../../shared/components/AccessProvider";

function ConfigForm() {
	const { config } = useConfiguration();
	const form = useForm<Config>({
		shouldFocusError: false,
	});

	useEffect(() => {
		form.reset(config ?? {});
	}, [config]);

	return (
		<div className="column gap-16 h-100">
			<FormProvider {...form}>
				<div className="flex-1">
					<Outlet />
				</div>
				<div style={{ paddingBottom: 32 }}>
					<SaveArea />
				</div>
			</FormProvider>
		</div>
	);
}

export function ConfigPage() {
	const { config } = useConfiguration();
	const user = useRecoilValue(UserState);
	const accessConfig = useRecoilValue(ConfigAccessState(config?.id));
	const appAccess = useAccess(AppAccessType.CONFIGURE);

	if (!appAccess) {
		throw new CustomError({
			message: i18n.t("You do not have configuration access"),
			name: i18n.t("Access denied"),
			icon: IconBlock24,
			actions: [
				{
					label: i18n.t("Go home"),
					primary: true,
					action: ({ navigate }) => {
						navigate("/");
					},
				},
			],
		});
	}

	if (
		!userHasAccess({
			user,
			accessConfig,
			access: ACCESS_VIEW_AND_EDIT,
		})
	) {
		throw new CustomError({
			message: `${i18n.t(
				"You do not have access to change the configuration for",
			)} ${config?.name}`,
			name: i18n.t("Access denied"),
			icon: IconBlock24,
			actions: [
				{
					label: i18n.t("Go back"),
					primary: true,
					action: ({ navigate }) => {
						navigate(-1);
					},
				},
			],
		});
	}
	return (
		<main className="w-100 row">
			<SideMenu />
			<div
				className="w-100 p-32"
				style={{
					flexGrow: 1,
					height: "calc(100vh - 48px)",
					overflowY: "auto",
					scrollbarGutter: "stable",
				}}
			>
				<ConfigForm />
			</div>
		</main>
	);
}
