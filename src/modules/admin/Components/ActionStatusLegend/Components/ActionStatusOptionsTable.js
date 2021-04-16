import {
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableFoot,
    TableHead,
    TableRow,
    TableRowHead,
    Button,
    Pagination
} from '@dhis2/ui';
import _ from 'lodash';
import SettingsIcon from '@material-ui/icons/Settings';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'


import React, {useEffect, useState} from 'react';
import ActionStatusOptionSetConstants from "../constants/actionStatus";
import {useAlert, useDataQuery} from "@dhis2/app-runtime";
import generateErrorAlert from "../../../../../core/services/generateErrorAlert";
import FullPageLoader from "../../../../../shared/Components/FullPageLoader";



const actionStatusOptionsQuery ={
    actionStatusOptions:{
        resource: 'options',
        params: ({page, pageSize})=>({
            page,
            pageSize,
            totalPages: true,
            fields:[
                'code',
                'name',
                'style[icon,color]'
            ],
            filter:[
                `optionSet.id:eq:${ActionStatusOptionSetConstants.ACTION_STATUS_OPTION_SET_ID}`
            ]
        })
    }
}

const columns = [
    'Name',
    'Code',
    'Color',
    'Icon',
    'Actions'
]

export default function ActionStatusTable() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const {loading, data, error} = useDataQuery(actionStatusOptionsQuery, {variables: {page, pageSize}});
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    useEffect(() => generateErrorAlert(show, error), [error])

    return (
        loading ? <FullPageLoader/>:
            <Table>
                <TableHead>
                    <TableRowHead>
                        {
                            _.map(columns, (column) => <TableCellHead
                                key={`${column}-action-status`}>{column}</TableCellHead>)
                        }
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {
                        _.map(data?.actionStatusOptions?.options, ({name, code, style}) => (
                            <TableRow key={`${code}-row`}>
                                <TableCell>{name}</TableCell>
                                <TableCell>{code}</TableCell>
                                <TableCell>{style?.color}</TableCell>
                                <TableCell>{style?.icon}</TableCell>
                                <TableCell><Button icon={<MoreHorizIcon/>}/></TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
                <TableFoot>
                    <TableRow >
                        <TableCell colSpan={columns.length.toString()}>
                            <Pagination
                                onPageChange={setPage}
                                onPageSizeChange={setPageSize}
                                page={page}
                                pageSize={pageSize}
                                {...data?.actionStatusOptions?.pager}
                            />
                        </TableCell>
                    </TableRow>
                </TableFoot>
            </Table>
    )
}
