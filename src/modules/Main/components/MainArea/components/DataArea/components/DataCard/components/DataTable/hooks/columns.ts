import {ActionConfig, CategoryConfig} from "../../../../../../../../../../../shared/schemas/config";
import {useMemo} from "react";
import {useColumns} from "../../../hooks/columns";
import {findLastIndex} from "lodash";


export function useTableColumns(config: CategoryConfig | ActionConfig) {
    const allColumns = useColumns();
    const columns = useMemo(() => {
        return allColumns.filter((column) => {
            return !!config.fields.find((field) => field.id === column.id)
        })
    }, [allColumns, config]);
    const childTableColSpan = useMemo(() => {
        const lastIndexOfTable = findLastIndex(allColumns, ['from', config.id]);

        if (lastIndexOfTable === -1) {
            return 0;
        }
        if (lastIndexOfTable === allColumns.length - 1) {
            return allColumns.length;
        }

        return allColumns.length - lastIndexOfTable - 1;

    }, [allColumns, config.id]);

    return {
        columns,
        childTableColSpan,
        allColumns
    }

}
