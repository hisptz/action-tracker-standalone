import {useConfiguration} from "./config";
import {useMemo} from "react";
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
                    'programTrackedEntityAttributes[mandatory,trackedEntityAttribute[id,displayName,valueType,optionSet[id,options[code,name]]]]',
                    'programStages[id,displayName,programStageDataElements[mandatory,dataElement[id,displayName,valueType,optionSet[id,options[code,name]]]]]',
                ]
            }
        )
    }
}


export function useMetadata() {
    const {config} = useConfiguration();
    const programs = useMemo(() => {
        const categoryProgram = head(config?.categories)?.id;
        const actionProgram = config?.action.id;

        return [
            categoryProgram,
            actionProgram
        ]
    }, [config])
    const {data, loading} = useDataQuery<{ programs: { programs: Program[] } }>(programQuery, {
        variables: {
            ids: programs
        }
    })

    return {
        loading,
        programs: data?.programs?.programs
    }
}
