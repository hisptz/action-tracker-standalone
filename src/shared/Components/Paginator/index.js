import {Pagination} from '@dhis2/ui';



export default function Paginator({pager, onPageChange,onPageSizeChange }){

    return(
        <>
            <Pagination
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                {...pager}
            />
        </>
    )
}
