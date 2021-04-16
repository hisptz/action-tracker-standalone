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
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import React, {useEffect, useState} from 'react';
import {useAlert, useDataQuery} from "@dhis2/app-runtime";
import generateErrorAlert from "../../../../../core/services/generateErrorAlert";
import FullPageLoader from "../../../../../shared/Components/FullPageLoader";
import ChallengeMethodConstants from "../constants/optionSets";

const methodsQuery = {
    methodOptions: {
        resource: 'options',
        params: ({page, pageSize}) => ({
            fields: [
                'code',
                'name'
            ],
            filter: [
                `optionSet.id:eq:${ChallengeMethodConstants.CHALLENGE_METHOD_OPTION_SET_ID}`
            ],
            page,
            pageSize,
            totalPages: true,
        })
    }
}

const columns = [
    'Name',
    'Code',
    'Actions'
]

export default function ChallengeMethodsTable() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const {loading, error, data, refetch} = useDataQuery(methodsQuery, {variables: {page, pageSize}});

    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    useEffect(() => generateErrorAlert(show, error), [error]);

    useEffect(() => {
        async function fetch() {
            await refetch({page, pageSize})
        }

        fetch();
    }, [page, pageSize]);

    return (
        loading ? <FullPageLoader/> :
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
                        _.map(data?.methodOptions?.options, ({name, code}) => (
                            <TableRow key={`${code}-row`}>
                                <TableCell>{name}</TableCell>
                                <TableCell>{code}</TableCell>
                                <TableCell><Button icon={<MoreHorizIcon/>}/></TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
                <TableFoot>
                    <TableRow>
                        <TableCell colSpan={columns.length.toString()}>
                            <Pagination
                                onPageChange={setPage}
                                onPageSizeChange={setPageSize}
                                page={page}
                                pageSize={pageSize}
                                {...data?.methodOptions?.pager}
                            />
                        </TableCell>
                    </TableRow>
                </TableFoot>
            </Table>
    )
}
