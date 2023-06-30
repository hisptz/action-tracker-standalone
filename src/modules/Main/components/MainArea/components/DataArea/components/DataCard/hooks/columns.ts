import {useConfiguration} from "../../../../../../../../../shared/hooks/config";
import {useCallback, useEffect, useMemo} from "react";
import {ColumnState, ColumnStateConfig, VisibleColumnState} from "../state/columns";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {useWindowSize} from "usehooks-ts";


export function useSetColumnState() {
    const {width} = useWindowSize();

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
        const averageWidth = Math.ceil((width - 64) / (columns.length ?? 1));
        console.log(averageWidth)
        return columns.map((column) => {
            return {
                ...column,
                width: averageWidth
            }
        });
    }, [config, width]);
    useEffect(() => setDefaultColumnState(tableHeaders), [width])
}

export function useResizeColumns() {

}

export function useColumns() {
    const {config} = useConfiguration();
    return useRecoilValue(VisibleColumnState(config?.id as string));
}

export function useManageColumns() {
    const {config} = useConfiguration();
    const {width} = useWindowSize()
    const [columns, setColumns] = useRecoilState(ColumnState(config?.id as string));

    const manageColumns = useCallback((columns: ColumnStateConfig[]) => {
        const visibleColumnsCount = columns.filter(({visible}) => visible).length;
        const averageWidth = Math.ceil((width - 64) / (visibleColumnsCount ?? 1));
        setColumns((prevColumns) => {
            return columns.map((column) => {
                return {
                    ...column,
                    width: averageWidth
                }
            })
        });
    }, [setColumns, width])

    return {
        columns,
        manageColumns
    }
}
