import { useDataQuery } from "@dhis2/app-runtime";
import {useState, useEffect} from 'react';

const query={
    organisationUnits: {
        resource: 'organisationUnits',
    id: ({id})=> id,
    params: ({level})=> ({
        fields: 'id,name,children[id,displayName,name,path],displayName,path',
        paging: false,
        level
    })
    }
}

export default function useOrganisationUnits(initLevel, initId=''){
    const [id, setId] = useState(initId);
    const [level, setLevel] = useState(initLevel);
    const {loading, data, error, refetch} = useDataQuery(query, {
        variables: {id, level}
    });

    useEffect(() => {
       refetch({variables: {id, level}})
    }, [id])

    console.log('rerender')


    return {loading, error, data, setId, setLevel}
}