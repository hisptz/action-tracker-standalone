import {useDataQuery} from "@dhis2/app-runtime";

const iconDataQuery = {
    iconData:{
        resource: 'icons',
        id:({id})=>id,
        params:{
            fields:[
                'key',
                'href',
                'keywords'
            ]
        }
    }
}

export function useDHIS2IconData(key=''){
    const {data, loading, error} = useDataQuery(iconDataQuery, {variables:{id: key}});
    return {error, loading, iconData: data?.iconData}
}
