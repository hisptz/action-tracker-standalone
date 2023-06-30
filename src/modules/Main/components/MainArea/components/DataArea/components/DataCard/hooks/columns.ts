import {useConfiguration} from "../../../../../../../../../shared/hooks/config";
import {useEffect, useMemo} from "react";
import {ColumnState, ColumnStateConfig} from "../state/columns";
import {useRecoilValue, useSetRecoilState} from "recoil";


export function useSetColumnState({width}: { width: number }) {
    //This sets the initial state of the columns;
    const {config} = useConfiguration();
    const setDefaultColumnState = useSetRecoilState(ColumnState(config?.id as string))
    const tableHeaders = useMemo(() => {
        if (!config) {
            return [];
        }
        const [, ...rest] = config.categories;

        const categoriesHeaders = rest.map(category => {
            return category.fields.filter(({showAsColumn}) => showAsColumn).map((field) => ({
                ...field,
                from: category.id
            }))
        }).flat();

        const actionsHeaders = config.action.fields.filter(({showAsColumn}) => showAsColumn).map((field) => ({
            ...field,
            from: config.action.id
        }));
        const columns = [...categoriesHeaders, ...actionsHeaders].map((header) => {
            return {
                id: header.id,
                visible: true,
                width: 0,
                name: header.name,
                from: header.from,
            } as ColumnStateConfig
        });

        console.log(width)

        const averageWidth = Math.ceil(width / (columns.length ?? 1));

        return columns.map((column) => {
            return {
                ...column,
                width: averageWidth
            }
        });
    }, [config, width]);
    useEffect(() => setDefaultColumnState(tableHeaders), [width])
}

export function useColumns() {
    const {config} = useConfiguration();
    return useRecoilValue(ColumnState(config?.id as string));
}

