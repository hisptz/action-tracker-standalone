import {ActionConstants, BottleneckConstants} from "../../../../../core/constants";
import {useEffect, useState} from "react";
import {useDataEngine} from "@dhis2/app-runtime";
import {DimensionsState} from "../../../../../core/states";
import {useRecoilValue} from "recoil";
import {map} from 'async'
import {sortBy} from "lodash";



export default function useData() {
    const [loading, setLoading] = useState();
    const [data, setData] = useState()
    const engine = useDataEngine()
    const {orgUnit} = useRecoilValue(DimensionsState)


    useEffect(() => {
        async function getPages() {
            setLoading(true)

        }
        getPages();
    }, [])

    return {
        data,
        loading
    }
}
