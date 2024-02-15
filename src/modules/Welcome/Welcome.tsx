import React, { useState } from "react";
import i18n from "@dhis2/d2-i18n";
import { useSetupMetadata } from "./hooks/metadata";
import { Navigate, useNavigate } from "react-router-dom";
import appLogo from "../../shared/assets/images/app-logo.png";
import { Button, ButtonStrip, CircularLoader, LinearLoader } from "@dhis2/ui";
import { useRecoilRefresher_UNSTABLE } from "recoil";
import { ConfigIdsState } from "../../shared/state/config";
import { isEmpty } from "lodash";
import {
	AccessProvider,
	AppAccessType,
} from "../../shared/components/AccessProvider";

export function Welcome() {
	const [error, setError] = useState<any>(null);
	const resetConfig = useRecoilRefresher_UNSTABLE(ConfigIdsState);

	const navigate = useNavigate();
	const {
		programs,
		loading,
		setupConfiguration,
		settingUpConfiguration,
		progress,
	} = useSetupMetadata();

	async function config() {
		try {
			const response = (await setupConfiguration()) as any;
			if (!response) {
				//No default programs
				navigate("/getting-started");
			}
			if (response?.httpStatusCode === 201) {
				resetConfig();
				navigate("/");
			} else {
				setError(response);
			}
		} catch (e: any) {
			setError(e);
		}
	}

	if (loading) {
		return (
			<div className="w-100 h-100 column center align-center">
				<img alt={i18n.t("app logo")} width={150} src={appLogo} />
				<h1>{i18n.t("Welcome to the Standalone Action Tracker")}</h1>
				<CircularLoader small />
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-100 h-100 column center align-center">
				<img alt={i18n.t("app logo")} width={150} src={appLogo} />
				<h1>{i18n.t("Welcome to the Standalone Action Tracker")}</h1>
				<div className="column gap-8 align-center">
					<span>
						{i18n.t(
							"There were issues with setting up configuration.",
						)}
					</span>
					<code>{error.message ?? error.toString()}</code>
					<ButtonStrip>
						<Button onClick={() => navigate("/")}>
							{i18n.t("Retry")}
						</Button>
					</ButtonStrip>
				</div>
			</div>
		);
	}

	if (!loading && isEmpty(programs)) {
		return <Navigate to={"/getting-started"} />;
	}

	return (
		<div className="w-100 h-100 column center align-center">
			<img alt={i18n.t("app logo")} width={150} src={appLogo} />
			<h1>{i18n.t("Welcome to the Standalone Action Tracker")}</h1>
			<AccessProvider
				shouldHide
				fallback={
					<div className="column gap-8 align-center text-center">
						<span>
							{i18n.t(
								"There are currently no configuration in this instance and you do not have configuration access. Please communicate with your administrator for the necessary access.",
							)}
						</span>
						<span>
							{i18n.t(
								"If you are the administrator, make sure you have the necessary authority to configure the standalone action tracker. Configuration of the authorities is done in the users app.",
							)}
						</span>
					</div>
				}
				access={AppAccessType.CONFIGURE}
			>
				{settingUpConfiguration ? (
					<div className="column gap-8 align-center text-center">
						<CircularLoader small />
						<span>
							{i18n.t("Setting up configuration. Please wait...")}
						</span>
						<LinearLoader amount={progress} />
					</div>
				) : (
					<div
						style={{ maxWidth: 800 }}
						className="column gap-8 align-center text-center"
					>
						<span>
							{i18n.t(
								"Previous version configuration have been detected in your system. You can decide to ignore them and start a new configuration or you can continue with the previous configuration.",
							)}
						</span>
						<ButtonStrip>
							<Button onClick={config}>
								{i18n.t("Use previous configuration")}
							</Button>
							<Button
								onClick={() => {
									navigate("/getting-started");
								}}
							>
								{i18n.t("Setup new configuration")}
							</Button>
						</ButtonStrip>
					</div>
				)}
			</AccessProvider>
		</div>
	);
}
