import {useDataQuery} from "@dhis2/app-runtime";
import {useDimensions} from "../../../../../../../../../../../shared/hooks";
import {useMemo} from "react";
import {fromPairs, get, isEmpty} from "lodash";
import {useColumns} from "../../../hooks/columns";
import {ActionConfig, CategoryConfig} from "../../../../../../../../../../../shared/schemas/config";

const teiQuery: any = {
    data: {
        resource: "tracker/relationships",
        params: ({id, page, pageSize, ou}: any) => ({
            enrollment: id,
            page,
            pageSize,
            orgUnit: ou,
            ouMode: 'DESCENDANTS',
            totalPages: true,
            fields: [
                `relationship`,
                `from[enrollment[enrollment,trackedEntity,attributes[attribute,value]]]`,
                `to[enrollment[enrollment,trackedEntity,attributes[attribute,value]]]`
            ],
        })
    }
}
const eventQuery: any = {
    data: {
        resource: "tracker/events",
        params: ({id, page, pageSize, ou, parent}: any) => ({
            programStage: id,
            page,
            pageSize,
            orgUnit: ou,
            ouMode: 'DESCENDANTS',
            totalPages: true,
        })
    }
}

export function useTableData(type: "program" | "programStage", {parentInstance, config}: {
    parentInstance: any,
    config: CategoryConfig | ActionConfig
}) {
    const {orgUnit} = useDimensions();
    const allColumns = useColumns();
    const {data, refetch, loading, error} = useDataQuery<{
        data: { instances: { to: any, from: any }[], page: number, pageSize: number, total: number }
    }>(type === "program" ? teiQuery : eventQuery, {
        variables: {
            id: type === "program" ? get(parentInstance, ['enrollments', 0, 'enrollment']) : parentInstance?.event,
            ou: orgUnit?.id,
        }
    });

    const rawData = useMemo(() => {
        return data?.data?.instances || []
    }, [data]);

    const instances = useMemo(() => {
        return rawData.map(({to}) => {
            return to?.[type === "program" ? "enrollment" : "event"];
        })
    }, [rawData]);


    const columns = useMemo(() => {
        return allColumns.filter((column) => {
            return !!config.fields.find((field) => field.id === column.id)
        })
    }, [allColumns, config])

    const rows = useMemo(() => {
        return instances?.map((instance) => {
            const data = type === "program" ? instance.attributes : instance.dataValues;
            return fromPairs(data?.map((item: any) => [item.attribute ?? item.dataElement, item.value]))
        })
    }, [instances])

    const noData = useMemo(() => isEmpty(rawData), [rawData])

    return {
        loading,
        noData,
        refetch,
        error,
        rows,
        columns
    }
}
