import {useConfiguration} from "../../../../../../../../../shared/hooks/config";
import {useMemo} from "react";
import {ColumnState, ColumnStateConfig} from "../state/columns";
import {useEffectOnce} from "usehooks-ts";
import {useRecoilValue, useSetRecoilState} from "recoil";


export function useSetColumnState() {
    //This sets the initial state of the columns;
    const {config} = useConfiguration();
    const setDefaultColumnState = useSetRecoilState(ColumnState(config?.id as string))
    const tableHeaders = useMemo(() => {
        if (!config) {
            return [];
        }
        const [, ...rest] = config.categories;

        const categoriesHeaders = rest.map(category => {
            return category.fields.filter(({showAsColumn}) => showAsColumn)
        }).flat();

        const actionsHeaders = config.action.fields.filter(({showAsColumn}) => showAsColumn);
        return [...categoriesHeaders, ...actionsHeaders].map((header) => {
            return {
                id: header.id,
                visible: true,
                width: 0,
                name: header.name,

            } as ColumnStateConfig
        });
    }, [config]);
    useEffectOnce(() => setDefaultColumnState(tableHeaders))

}


export function useColumns() {
    const {config} = useConfiguration();
    return useRecoilValue(ColumnState(config?.id as string));
}
