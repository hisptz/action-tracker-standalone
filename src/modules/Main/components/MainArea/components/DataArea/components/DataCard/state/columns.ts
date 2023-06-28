import {atomFamily} from "recoil";

export interface ColumnStateConfig {
    id: string;
    visible: boolean;
    width: number;
    name: string;
}

export const ColumnState = atomFamily<ColumnStateConfig[], string>({
    key: 'column-state',
    default: []
})
