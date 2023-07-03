import {useDataQuery} from "@dhis2/app-runtime";
import {useDimensions} from "../../../../../../../../../../../shared/hooks";
import {useMemo} from "react";
import {fromPairs, get, isEmpty} from "lodash";

const relationshipQuery: any = {
    data: {
        resource: "tracker/relationships",
        params: ({enrollment, event, page, pageSize, ou}: any) => ({
            enrollment,
            event,
            page,
            pageSize,
            orgUnit: ou,
            ouMode: 'DESCENDANTS',
            totalPages: true,
            order: `createdAt:asc`,
            fields: [
                `relationship`,
                `from[enrollment[enrollment],event[event]]`,
                `to[enrollment[enrollment,enrolledAt,occurredAt,orgUnit,program,trackedEntity,attributes[attribute,value]],event[event,orgUnit,program,programStage,trackedEntity,enrollment,occurredAt,dataValues[dataElement,value]]]`
            ],
        })
    }
}

export function useTableData(type: "program" | "programStage", {parentInstance, parentType}: {
    parentInstance: any,
    parentType: "program" | "programStage"
}) {
    const {orgUnit} = useDimensions();
    const {data, refetch, loading, error} = useDataQuery<{
        data: { instances: { to: any, from: any }[], page: number, pageSize: number, total: number }
    }>(relationshipQuery, {
        variables: {
            enrollment: parentType === "program" ? get(parentInstance, ['enrollments', 0, 'enrollment']) : undefined,
            event: parentType === "programStage" ? get(parentInstance, ['event']) : undefined,
            ou: orgUnit?.id,
            page: 1,
            pageSize: 10
        }
    });

    const rawData = useMemo(() => {
        return data?.data?.instances || []
    }, [data]);

    const instances = useMemo(() => {
        return rawData.filter((item) => {
            if (parentType === "program") {
                return item?.to?.enrollment?.enrollment !== get(parentInstance, ['enrollments', 0, 'enrollment'])
            } else {
                return item?.to?.event?.event !== get(parentInstance, ['event'])
            }
        }).map(({to}) => {
            return to?.[type === "program" ? "enrollment" : "event"];
        })
    }, [rawData]);


    const rows = useMemo(() => {
        return instances?.map((instance) => {
            const data = type === "program" ? instance.attributes : instance.dataValues;
            return {
                ...fromPairs(data?.map((item: any) => [item.attribute ?? item.dataElement, item.value])),
                instance
            } as Record<string, any>
        })
    }, [instances])

    const noData = useMemo(() => isEmpty(rawData), [rawData]);

    const pagination = useMemo(() => {
        return {
            page: data?.data?.page ?? 1,
            pageSize: data?.data?.pageSize ?? 10,
            total: data?.data?.total ?? 1,
            pageCount: Math.ceil(data?.data?.total ?? 1 / data?.data?.pageSize ?? 1),
            onPageChange: (page: number) => {
                refetch({
                    page
                })
            },
            onPageSizeChange: (pageSize: number) => {
                refetch({
                    pageSize,
                    page: 1
                })
            }
        }
    }, [data, refetch])

    return {
        loading,
        noData,
        refetch,
        error,
        rows,
        pagination
    }
}
