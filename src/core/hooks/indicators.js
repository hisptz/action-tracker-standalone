import {useDataEngine, useDataQuery} from "@dhis2/app-runtime";
import {useCallback, useEffect, useRef, useState} from "react";
import {debounce} from "lodash";

const indicatorQuery = {
    data: {
        resource: 'indicators',
        params: ({page, keyword}) => ({
            page,
            pageSize: 10,
            totalCount: true,
            filter: keyword && [
                `displayName:ilike:${keyword}`
            ],
            fields: [
                'id',
                'displayName'
            ]
        })
    }
}


export default function useIndicators() {
    const engine = useDataEngine()
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState();

    const fetch = useCallback(async (page, keyword) => {
        if (keyword) {
            return await engine.query(indicatorQuery, {variables: {page, keyword}})
        }
        return await engine.query(indicatorQuery, {variables: {page}})

    }, [])

    async function getInitialData() {
        setLoading(true)
        setPage(1)
        try {
            const results = await fetch(1)
            if (results) {
                setTotalPages(results?.data?.pager?.pageCount)
                setData(results?.data?.indicators)
            }
        } catch (e) {
            setError(e)
        }
        setLoading(false)
    }

    const search = useRef(debounce(async (keyword) => {
        if (keyword) {
            setLoading(true)
            try {
                setPage(1)
                const results = await fetch(1, keyword)
                if (results) {
                    setTotalPages(results?.data?.pager?.pageCount)
                    setData(results?.data?.indicators)
                }
            } catch (e) {
                setError(e)
            }
            setLoading(false)
        } else {
            await getInitialData()
        }
    }, 1000))

    const nextPage = useCallback(async () => {
        if (totalPages && page < totalPages) {
            setPage(prevState => prevState + 1)
            setLoading(true)
            try {
                const results = await fetch(page + 1)
                if (results) {
                    if (!totalPages) {
                        setTotalPages(results?.data?.pager?.pageCount)
                    }
                    setData(prevState => ([...prevState, ...results?.data?.indicators]))
                }
            } catch (e) {
                setError(e)
            }
            setLoading(false)
        }
    }, [page, totalPages])

    useEffect(() => {
        getInitialData();
    }, []);


    return {
        indicators: data,
        search: search.current,
        nextPage,
        loading,
        error
    }
}

const indicatorNameQuery = {
    data: {
        resource: 'indicators',
        id: ({id}) => id,
        params: {
            fields: ['name', 'displayName']
        }
    }
}

export function useIndicatorsName(indicatorId = '') {
    const {loading, data, error} = useDataQuery(indicatorNameQuery, {variables: {id: indicatorId}});
    return {loading, error, name: data?.data.displayName}
}
