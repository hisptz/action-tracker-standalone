import {useSetRecoilState} from "recoil";
import {ConfigState} from "../states";
import {useDataMutation, useDataQuery} from "@dhis2/app-runtime";
import {useEffect} from "react";
import {ACTION_PROGRAM_ID, BOTTLENECK_PROGRAM_ID, PROGRAMS} from "../constants";


const programFields = [
    'id',
    'programTrackedEntityAttributes[displayInList,mandatory,searchable, trackedEntityAttribute[id,name,formName,valueType]]',
    'programStages[id, programStageDataElements[compulsory,displayInReports,dataElement[name,id,formName,valueType,optionSet[options[code, name]]]'
];

const configQuery = {
    bottleneckProgramMetadata: {
        id: BOTTLENECK_PROGRAM_ID,
        resource: 'programs',
        params: {
            fields: programFields
        }
    },
    actionProgramMetadata: {
        resource: 'programs',
        id: ACTION_PROGRAM_ID,
        params: {
            fields: programFields
        }
    }
}

const programConfigMutation = {
    type: 'create',
    resource: 'metadata',
    data: ({programs}) => programs,
    params: {
        importMode: 'COMMIT',
        importStrategy: 'CREATE_AND_UPDATE',
    }
}

export default function useAppConfig() {
    const setConfig = useSetRecoilState(ConfigState);
    const {loading, data, error, refetch} = useDataQuery(configQuery);
    const [programMutate, {
        loading: firstTimeUseLoading,
        error: mutationError
    }] = useDataMutation(programConfigMutation,
        {
            variables: {
                programs: PROGRAMS
            },
            onComplete: () => refetch()
        });

    useEffect(() => {
        async function setConfigData() {
            if (!loading && data && !error) {
                setConfig(data);
            }
            if (!loading && !data) {
                await programMutate()
            }
        }

        setConfigData();
    }, [loading])

    return {loading, firstTimeUseLoading, mutationError, error};
}
