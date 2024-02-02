import { useDataQuery } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { debounce, filter, find } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { AutoComplete } from "./Autocomplete";

const query = {
	search: {
		resource: "sharing/search",
		params: ({ search }: any) => ({
			key: search,
		}),
	},
};

function useSearch({
	selected,
	onSelection,
}: {
	selected?: { id: string; displayName?: string; name?: string };
	onSelection: (selected: any) => void;
}) {
	const [search, setSearch] = useState("");
	const [showResults, setShowResults] = useState(false);
	const [userAccess, userGroupAccess] = useWatch({
		name: ["userAccess", "userGroupAccess"],
	});
	/**
	 * NOTE:
	 * HOW WE WILL FETCH DATA USING DATA QUERY TO SHARING/SEARCH AS RESOURCE
	 */
	const { data, refetch, fetching } = useDataQuery(query, {
		lazy: true,
		onComplete: () => setShowResults(true),
	});

	useEffect(() => {
		setSearch(selected?.name ?? selected?.displayName ?? "");
	}, [selected]);

	const debouncedRefetch = useCallback(debounce(refetch, 250), [refetch]);

	useEffect(() => {
		if (search) {
			if (!selected) {
				debouncedRefetch({ search });
			}
		} else {
			onSelection(undefined);
			setShowResults(false);
		}
	}, [debouncedRefetch, onSelection, search, selected]);

	// Concatenate all the results
	const filteredResults: Array<any> = useMemo(() => {
		const searchResults = data?.search as unknown as {
			users: any[];
			userGroups: any[];
		};

		if (selected || !search) {
			return [];
		}
		const all = [
			...(searchResults?.users?.map((user) => ({
				...user,
				type: "user",
			})) ?? []),
			...(searchResults?.userGroups?.map((userGroup) => ({
				...userGroup,
				type: "userGroup",
			})) ?? []),
		];
		return filter(all, (item) => {
			if (item.type === "user") {
				return !find(userAccess, (access) => access.id === item.id);
			} else if (item.type === "userGroup") {
				return !find(
					userGroupAccess,
					(access) => access.id === item.id,
				);
			}
			return true;
		});
	}, [data?.search, search, selected, userAccess, userGroupAccess]);

	return {
		fetching,
		showResults,
		search,
		filteredResults,
		setShowResults,
		setSearch,
	};
}

export function SharingAutoComplete({
	selected,
	onSelection,
}: {
	selected?: { id: string; displayName?: string; name?: string };
	onSelection: (selected: any) => void;
}): React.ReactElement {
	const {
		showResults,
		setShowResults,
		setSearch,
		filteredResults,
		search,
		fetching,
	} = useSearch({
		selected,
		onSelection,
	});

	return (
		<AutoComplete
			showResults={showResults}
			label={i18n.t("User, group or role")}
			loading={fetching}
			placeholder={i18n.t("Search")}
			search1={search}
			searchResults={showResults ? filteredResults : []}
			onClose={() => setShowResults(false)}
			onSearch={setSearch}
			onSelect={(id: string) => {
				onSelection(
					filteredResults.find((result: any) => result.id === id),
				);
				setShowResults(false);
			}}
		/>
	);
}
