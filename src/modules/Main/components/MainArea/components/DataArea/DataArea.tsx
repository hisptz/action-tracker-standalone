import React from 'react';
import {FullPageLoader} from "../../../../../../shared/components/Loaders";
import {useCategoryData} from "./hooks/data";
import {colors, Pagination} from "@dhis2/ui"
import {DataCard} from "./components/DataCard";
import {isEmpty} from "lodash";
import i18n from '@dhis2/d2-i18n';
import {AddButton} from "../AddButton";

export function DataArea() {
    const {loading, categoryData, category, refetch, ...pagination} = useCategoryData()
    if (loading) {
        return (
            <FullPageLoader/>
        )
    }

    if (isEmpty(categoryData)) {

        return (
            <div className="column w-100 h-100 align-center center gap-16">
                <h1 style={{color: colors.grey800}}>{i18n.t("There are is no data for the the selected dimensions.")}</h1>
                <AddButton primary/>
            </div>
        )
    }

    return (
        <div className="column gap-32">
            {
                categoryData?.map((data) => (
                    <DataCard refetch={refetch} instanceConfig={category} key={`${data.trackedEntity}-card`}
                              data={data}/>))
            }
            <Pagination {...pagination} />
        </div>
    )
}

