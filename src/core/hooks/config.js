import {useSetRecoilState} from 'recoil';
import {ConfigState} from '../states';
import {useDataEngine, useDataMutation, useDataQuery} from '@dhis2/app-runtime';
import {useEffect, useState} from 'react';
import {ActionConstants, BottleneckConstants, PROGRAMS} from '../constants';
import actionStatusSettingsMetadata from '../../resources/Json/ActionStatusSettingsMetadata.json';
import challengeSettingsMetadata from '../../resources/Json/ChallengeSettingsMetadata.json';
import useUser from "./user";
import {useOrganisationUnitLevel} from "./organisationUnit";
import {useDataStore} from "@dhis2/app-service-datastore";
import {EngineState, GlobalSettingsState} from "../states/config";

const programFields = [
    'id',
    'programTrackedEntityAttributes[displayInList,mandatory,searchable, trackedEntityAttribute[id,name,formName,valueType,optionSet[options[code, name,style[color, icon]]]]',
    'programStages[id, programStageDataElements[compulsory,displayInReports,dataElement[name,id,formName,valueType,optionSet[options[code, name,style[color, icon]]]',
];

const configQuery = {
    bottleneckProgramMetadata: {
        id: BottleneckConstants.PROGRAM_ID,
        resource: 'programs',
        params: {
            fields: programFields,
        },
    },
    actionProgramMetadata: {
        resource: 'programs',
        id: ActionConstants.PROGRAM_ID,
        params: {
            fields: programFields,
        },
    },
};

const programConfigMutation = {
    type: 'create',
    resource: 'metadata',
    data: ({programs}) => programs,
    params: {
        importMode: 'COMMIT',
        importStrategy: 'CREATE_AND_UPDATE',
    },
};

const optionSetSortingMutation = {
    type: 'update',
    resource: 'optionSets',
    id: ({id}) => id,
    params: {
        mergeMode: 'REPLACE'
    },
    data: ({data}) => data
}
const optionSetSchemaUpdate = {
    type: 'create',
    resource: 'schemas/optionSet',
    data: ({data}) => data
}

async function sortOptionsInOptionSets(optionSets = [], engine) {
    for (const optionSet of optionSets) {
        await engine.mutate(optionSetSchemaUpdate, {variables: {data: optionSet}});
        await engine.mutate(optionSetSortingMutation, {variables: {data: optionSet, id: optionSet?.id}})
    }
}


export function useDataStoreSettings() {
    const setGlobalSettingsState = useSetRecoilState(GlobalSettingsState)
    const {globalSettings} = useDataStore();

    useEffect(() => {
        if (globalSettings) {
            setGlobalSettingsState(globalSettings?.settings)
        }
    }, [globalSettings])
}

function useSetEngine() {
    const engine = useDataEngine()
    const setEngine = useSetRecoilState(EngineState);

    useEffect(() => setEngine(engine), [])

}

export function useAppConfig() {
    const setConfig = useSetRecoilState(ConfigState);
    const engine = useDataEngine();
    const {loading, data, refetch, error: queryError} = useDataQuery(configQuery,);
    const [error, setError] = useState();
    const [isFirstTime, setIsFirstTime] = useState(false);
    const [
        programMutate,
        {loading: firstTimeUseLoading},
    ] = useDataMutation(programConfigMutation, {
        variables: {
            programs: PROGRAMS,
        },
        onComplete: async () => {
            await sortOptionsInOptionSets(PROGRAMS.optionSets, engine);
            refetch()
        },
        onError: (e) => setError(e)
    });

    useEffect(() => {
        async function setConfigData() {
            if (!loading && data && !queryError) {
                setConfig({
                    ...data,
                    actionStatusSettingsMetadata: actionStatusSettingsMetadata.fields,
                    challengeSettingsMetadata: challengeSettingsMetadata.fields,
                });
            }
            if (!loading && !data && queryError) {
                if (queryError?.details?.httpStatusCode === 404) {
                    setIsFirstTime(true);
                    await programMutate();
                } else {
                    setError(queryError);
                }
            }
        }

        setConfigData();
    }, [loading]);

    return {loading, isFirstTime, firstTimeUseLoading, error};
}

export default function useAllConfig() {
    useSetEngine()
    const {loading, firstTimeUseLoading, error: configError} = useAppConfig();
    const {loading: userLoading, error: userError} = useUser();
    const {loading: orgUnitLevelLoading, error: orgUnitLevelError, noConfig} = useOrganisationUnitLevel();
    return {
        firstTimeUseLoading,
        loading: (userLoading || loading || orgUnitLevelLoading),
        error: (configError || userError || orgUnitLevelError),
        noConfig
    }
}
