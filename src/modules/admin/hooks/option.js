import {useDataEngine} from "@dhis2/app-runtime";
import {useEffect, useState} from "react";

const updateOptionMutation = {
    type: 'update',
    resource: 'options',
    id: ({id}) => id,
    data: ({data}) => data,
    params: {
        mergeMode: 'REPLACE'
    }
}

const deleteOptionMutation = {
    resource: 'options',
    type: 'delete',
    id: ({id}) => id,
    data: ({data}) => data
}
const deleteOptionFromOptionSetMutation = {
    resource: 'optionSets',
    type: 'delete',
    id: ({id}) => id,
}

const createOptionSchemaMutation = {
    resource: 'schemas/option',
    type: 'create',
    data: ({data}) => data
}

const createOptionMutation = {
    resource: 'options',
    type: 'create',
    data: ({data}) => data

}
const updateOptionSetMutation = {
    resource: 'optionSets',
    type: 'update',
    id: ({id}) => id,
    data: ({data}) => data,
    params: {
        mergeMode: 'REPLACE'
    }
}


export default function useOptionsMutation(type, optionSet, {onComplete, onError}) {
    const engine = useDataEngine();
    const [loading, setLoading] = useState();
    const [error, setError] = useState();
    const [response, setResponse] = useState();
    const [data, setData] = useState(undefined);

    const mutate = (payload) => setData(payload);

    async function updateMutation() {
        setLoading(true)
        try {
            const updateOptionResponse  = await engine.mutate(updateOptionMutation, {
                variables: {id: data?.id, data},
                onError: (e)=>{setError(e); onError(e);}
            });
            setLoading(false);
            setResponse(updateOptionResponse);
            setData(undefined);
            onComplete(response);
        } catch (e) {
            setData(undefined)
            setLoading(false);
            setError(e);
            onError(e);
        }
    }

    async function createMutation() {
        setLoading(true);
        try {
            await engine.mutate(createOptionSchemaMutation, {
                variables: {data},
                onError: (e)=>{setError(e); onError(e);},
            });
            await engine.mutate(createOptionMutation, {
                variables: {data},
                onError: (e)=>{setError(e); onError(e);}
            });
            const options = [...optionSet?.options];
            options.push(data);
            const modifiedOptionSet = _.set(optionSet, ['options'], options)
            const updateOptionSetResponse = await engine.mutate(updateOptionSetMutation, {
                variables: {
                    id: optionSet?.id,
                    data: modifiedOptionSet
                },
                onError: (e)=>{setError(e); onError(e);}
            });
            setLoading(false);
            setResponse(updateOptionSetResponse)
            onComplete(response)
        } catch (e) {
            setLoading(false)
            setError(e);
            onError(e);
        }
    }

    async function deleteMutation() {
        setLoading(true);
        try {
            await engine.mutate(deleteOptionFromOptionSetMutation, {
                variables: {
                    id: `${optionSet?.id}/options/${data?.id}`,
                    onError: (e)=>{setError(e); onError(e);}
                }
            })
            const deleteOptionResponse = await engine.mutate(deleteOptionMutation, {
                variables: {id: data?.id},
                onError: (e)=>{setError(e); onError(e);}
            });
            setLoading(false);
            setResponse(deleteOptionResponse);
            onComplete(response);
        } catch (e) {
            setLoading(false)
            setError(e);
            onError(e);
        }
    }

    useEffect(() => {
        async function mutation() {
            if (data) {
                switch (type) {
                    case 'create':
                        await createMutation();
                        break;
                    case 'update':
                        await updateMutation();
                        break;
                    case 'delete':
                        await deleteMutation();
                        break;
                }
            }
        }
        mutation();
    }, [type, data])

    return {loading, error, response, mutate}
}
