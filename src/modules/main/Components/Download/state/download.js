import {atom, selector} from "recoil";
import {ActionConstants, BottleneckConstants} from "../../../../../core/constants";
import {sortBy} from "lodash";
import {map} from "async";
import {EngineState} from "../../../../../core/states/config";
import {DimensionsState} from "../../../../../core/states";


const paginationQuery = {
    pagination: {
        resource: 'trackedEntityInstances',
        params: ({ou}) => ({
                program: BottleneckConstants.PROGRAM_ID,
                ou,
                fields: 'none',
                totalPages: true,
                skipData: true,
                pageSize: 100
            }
        )
    }
}

const bottlenecksQuery = {
    bottlenecks: {
        resource: 'trackedEntityInstances',
        params: ({page, ou}) => {
            return {
                program: BottleneckConstants.PROGRAM_ID,
                ou,
                page,
                pageSize: 100,
                fields: [...BottleneckConstants.FIELDS, 'relationships[to[trackedEntityInstance]]'],
            }
        }
    }
}

const actionsQuery = {
    actions: {
        resource: 'trackedEntityInstances',
        params: ({page, trackedEntityInstances, ou}) => {
            return {
                program: ActionConstants.PROGRAM_ID,
                page,
                pageSize: 400,
                fields: ActionConstants.ACTION_QUERY_FIELDS,
                skipPaging: true,
                trackedEntityInstance: trackedEntityInstances?.join(';'),
                ou,
            }
        }
    }
}


async function getPagination(engine, orgUnit) {
    return await engine.query(paginationQuery, {variables: {ou: orgUnit?.id}})
}

const getBottleneckData = async (engine, orgUnit, page) => {
    const {bottlenecks} = await engine.query(bottlenecksQuery, {variables: {ou: orgUnit?.id, page}})
    const sortedBottleneckData = sortBy(bottlenecks?.trackedEntityInstances, (item) => new Date(item.created))
    return map(sortedBottleneckData, async (bottleneck) => {
        const actionsIds = bottleneck?.relationships?.map(({to}) => to?.trackedEntityInstance?.trackedEntityInstance)
        const {actions} = await engine.query(actionsQuery, {
            variables: {
                trackedEntityInstances: actionsIds,
                ou: orgUnit?.id
            }
        })
        return {
            bottleneck,
            actions: sortBy(actions?.trackedEntityInstances, ((item) => new Date(item.created)))
        }
    })
}


export const DownloadType = atom({
    key: 'download-type',
    default: undefined
})

export const DownloadActive = atom({
    key: 'download-active',
    default: false
})

export const DownloadRequestId = atom({
    key: 'download-request-id',
    default: 0
})

export const DownloadedData = atom({
    key: 'downloadedData',
    default: selector({
        key: 'data-fetcher',
        get: async ({get}) => {
            try {
                const engine = get(EngineState)
                const {orgUnit} = get(DimensionsState)
                const {pagination} = await getPagination(engine, orgUnit);
                const totalPages = pagination?.pager?.pageCount;
                get(DownloadRequestId);
                if (totalPages) {
                    const bottlenecks = []
                    for (let i = 0; i < totalPages; i++) {
                        bottlenecks.push(...(await getBottleneckData(engine, orgUnit, i + 1)))
                    }
                    return bottlenecks;
                }
            } catch (e) {
                console.error(e)
            }
        }
    })
})
