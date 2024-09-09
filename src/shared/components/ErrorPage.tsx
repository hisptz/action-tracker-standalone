import { Button, ButtonStrip, colors, IconError24 } from "@dhis2/ui";
import React, { useState } from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import i18n from "@dhis2/d2-i18n";
import { isEmpty } from "lodash";
import { CustomError, ErrorAction } from "../models/error";

export default function ErrorPage({
	error: errorFromBoundary,
	resetErrorBoundary,
}: {
	error?: CustomError;
	resetErrorBoundary?: () => void;
}) {
	const error = errorFromBoundary ?? (useRouteError() as CustomError);
	const [showStack, setShowStack] = useState(false);

	const navigate = useNavigate();

	const Icon = error.icon ?? IconError24;

	return (
		<div
			style={{ minHeight: 400 }}
			className="h-100 w-100 column center align-center gap-8"
		>
			<div className="size-48">
				<Icon color={colors.grey800} />
			</div>
			<h3
				style={{
					color: colors.grey800,
					margin: 0,
				}}
			>
				{error.name ?? i18n.t("Something went wrong")}
			</h3>
			<span>{error.message}</span>
			{showStack && (
				<div
					style={{
						width: "50%",
						display: "flex",
						justifyContent: "center",
						background: colors.grey200,
						maxWidth: 800,
						padding: 16,
						margin: 8,
						border: `1px solid ${colors.grey400}`,
					}}
				>
					<code style={{ color: colors.red500 }}>{error.stack}</code>
				</div>
			)}

			{!isEmpty(error.actions) ? (
				<ButtonStrip>
					{error.actions?.map((action: ErrorAction, index) => {
						return (
							<Button
								primary={action.primary}
								key={action.label.toString()}
								onClick={() => action.action({ navigate })}
							>
								{action.label}
							</Button>
						);
					})}
				</ButtonStrip>
			) : (
				<>
					<ButtonStrip>
						<Button
							onClick={() => {
								if (resetErrorBoundary) {
									resetErrorBoundary();
									return;
								}
								window.location.reload();
							}}
						>
							{i18n.t("Reload")}
						</Button>
						<Button
							onClick={() =>
								setShowStack((prevState) => !prevState)
							}
						>
							{showStack ? "Hide" : "Show"} details
						</Button>
					</ButtonStrip>
				</>
			)}
		</div>
	);
}
