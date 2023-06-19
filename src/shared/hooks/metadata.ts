import {useConfiguration} from "./config";
import {useEffect, useMemo} from "react";
import {head} from "lodash";
import {useDataQuery} from "@dhis2/app-runtime";
import {Program} from "@hisptz/dhis2-utils";

const programQuery: any = {
    programs: {
        resource: "programs",
        params: ({ids}: { ids: string [] }) => (
            {
                filter: [
                    `id:in:[${ids.join(',')}]`
                ],
                fields: [
                    'id',
                    'displayName',
                    'programTrackedEntityAttributes[mandatory,trackedEntityAttribute[id,displayName,valueType,shortName,formName,optionSet[id,options[code,name]]]]',
                    'programStages[id,displayName,programStageDataElements[mandatory,dataElement[id,displayName,shortName,valueType,formName,optionSet[id,options[code,name]]]]]',
                ]
            }
        )
    }
}


export function useMetadata() {
    const {config} = useConfiguration();
    const programs = useMemo(() => {
        if (!config) return;
        const categoryProgram = head(config?.categories)?.id;
        const actionProgram = config?.action.id;

        return [
            categoryProgram,
            actionProgram
        ]
    }, [config])
    const {data, refetch, loading} = useDataQuery<{ programs: { programs: Program[] } }>(programQuery, {
        variables: {
            ids: programs
        },
        lazy: true
    });
    useEffect(() => {
        if (programs) {

            refetch({ids: programs})
        }
    }, [programs])

    return {
        loading,
        programs: data?.programs?.programs
    }
}
