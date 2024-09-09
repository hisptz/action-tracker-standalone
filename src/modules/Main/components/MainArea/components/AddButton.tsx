import { Button, IconAdd24 } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import React, { useMemo } from "react";
import { useConfiguration } from "../../../../../shared/hooks/config";
import { head } from "lodash";
import { useSearchParams } from "react-router-dom";
import { useBoolean } from "usehooks-ts";
import { Form } from "../../../../../shared/components/Form";
import { useCategoryContext } from "./DataProvider";
import {
	AccessProvider,
	AppAccessType,
} from "../../../../../shared/components/AccessProvider";

export function AddButton({ primary }: { primary?: boolean }) {
	const { config } = useConfiguration();
	const {
		value: hide,
		setTrue: onClose,
		setFalse: onOpen,
	} = useBoolean(true);
	const [searchParams] = useSearchParams();
	const { refetch } = useCategoryContext();

	const initialCategory = useMemo(() => {
		if (config) {
			return head(config.categories) ?? config.action;
		}
	}, [config]);
	const planning = useMemo(
		() => searchParams.get("type") === "planning",
		[searchParams],
	);

	if (!planning) {
		return null;
	}

	return (
		<>
			<Form
				onSaveComplete={() => refetch()}
				instanceName={`${initialCategory?.name?.toLowerCase()}`}
				id={initialCategory?.id as string}
				type="program"
				hide={hide}
				onClose={onClose}
			/>
			<AccessProvider access={AppAccessType.PLAN}>
				<Button primary={primary} onClick={onOpen} icon={<IconAdd24 />}>
					{`${i18n.t("Add")} ${initialCategory?.name?.toLowerCase()}`}
				</Button>
			</AccessProvider>
		</>
	);
}
