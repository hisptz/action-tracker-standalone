import {atomFamily, selectorFamily} from "recoil";

export interface ColumnStateConfig {
    id: string;
    visible: boolean;
    width: number;
    name: string;
    from: string;
}

export const ColumnState = atomFamily<ColumnStateConfig[], string>({
    key: 'column-state',
    default: []
})

export const VisibleColumnState = selectorFamily<ColumnStateConfig[], string>({
    key: 'visible-column-state',
    get: (id: string) => ({get}) => {
        const columns = get(ColumnState(id));
        return columns.filter(column => column.visible);
    }
})

export const TrackingColumnsState = selectorFamily<ColumnStateConfig[], string>({
    key: 'tracking-columns-state',
    get: (id: string) => ({get}) => {
        const columns = get(ColumnState(id));
        return columns.filter(column => column.from === 'tracking');
    }
})
