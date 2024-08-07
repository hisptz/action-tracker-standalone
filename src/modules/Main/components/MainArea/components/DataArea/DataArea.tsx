import { FullPageLoader } from "../../../../../../shared/components/Loaders";
import { colors, Pagination } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import { AddButton } from "../AddButton";
import React from "react";
import { useCategoryContext } from "../DataProvider";
import { isEmpty } from "lodash";
import { DataCard } from "./components/DataCard";
import { ViewModalProvider } from "../../../../../../shared/components/ViewModal";

export function DataArea() {
	const { loading, category, categoryData, refetch, error, ...pagination } =
		useCategoryContext();

	if (loading) {
		return <FullPageLoader />;
	}

	if (error) {
		return (
			<div className="column w-100 h-100 align-center center gap-16">
				<h1 style={{ color: colors.grey800 }}>
					{i18n.t("There was an error loading the data.")}
				</h1>
			</div>
		);
	}
	if (isEmpty(categoryData)) {
		return (
			<div className="column w-100 h-100 align-center center gap-16">
				<h1 style={{ color: colors.grey800 }}>
					{i18n.t(
						"There is no data for the the selected dimensions.",
					)}
				</h1>
				<AddButton primary />
			</div>
		);
	}

	return (
		<div className="column gap-32">
			<ViewModalProvider>
				{categoryData?.map((data, index) => (
					<DataCard
						index={index}
						refetch={refetch}
						instanceConfig={category}
						key={`${data.trackedEntity}-card`}
						data={data}
					/>
				))}
			</ViewModalProvider>
			<Pagination {...pagination} />
		</div>
	);
}
