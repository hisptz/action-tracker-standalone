import {getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {ActionConfig, CategoryConfig} from "../../../../../../../../../../../shared/schemas/config";

export function useCategoryTable({config,}: { config: CategoryConfig | ActionConfig }) {


    const {} = useReactTable({
        columns: [],
        data: [],
        debugTable: true,
        getCoreRowModel: getCoreRowModel(),
    })
}
