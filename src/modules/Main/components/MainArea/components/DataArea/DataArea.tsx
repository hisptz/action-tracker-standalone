import React from 'react';
import {FullPageLoader} from "../../../../../../shared/components/Loaders";
import {useCategoryData} from "./hooks/data";
import {Pagination} from "@dhis2/ui"
import {DataCard} from "./components/DataCard";

export function DataArea() {
    const {loading, categoryData, category, ...pagination} = useCategoryData()
    if (loading) {
        return (
            <FullPageLoader/>
        )
    }

    return (
        <div className="column gap-32">
            {
                categoryData?.map((data) => (
                    <DataCard instanceConfig={category} key={`${data.trackedEntity}-card`} data={data}/>))
            }
            <Pagination {...pagination} />
        </div>
    )
}
