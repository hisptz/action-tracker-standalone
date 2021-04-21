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
import {getFormattedDate} from "../../../../../core/helpers/utils";
import Grid from "@material-ui/core/Grid";
import {CardContent, Fab} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ChallengeSettingsFormDialog from "../../Dialogs/ChallengeSettingsFormDialog";
import TableActionsMenu from "../../../../main/Components/TableActionsMenu";
import {OptionDeleteConfirmation} from "../../../../../shared/Components/DeleteConfirmation";
import FullPageError from "../../../../../shared/Components/FullPageError";

const methodsQuery = {
    methodOptions: {
        resource: 'options',
        params: ({page, pageSize}) => ({
            fields: [
                'code',
                'name',
                'style[icon,color]',
                'lastUpdated',
                'id',
                'optionSet[id]',
                'sortOrder'
            ],
            filter: [
                `optionSet.id:eq:${ChallengeMethodConstants.CHALLENGE_METHOD_OPTION_SET_ID}`
            ],
            page,
            pageSize,
            totalPages: true,
        })
    },
    actionStatusOptionSet: {
        resource: 'optionSets',
        id: ChallengeMethodConstants.CHALLENGE_METHOD_OPTION_SET_ID ,
        params: {
            fields: [
                'id',
                'options[name,code,id,sortOrder]',
                'name',
                'valueType',
                'code'
            ]
        }
    }
}

const columns = [
    'Name',
    'Code',
    'Last Updated',
    'Actions'
]

export default function ChallengeMethodsTable() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const {loading, error, data, refetch} = useDataQuery(methodsQuery, {variables: {page, pageSize}});

    const [ref, setRef] = useState(undefined);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedOption, setSelectedOption] = useState();


    const onDelete = () => {
        setOpenDelete(true);
    }

    const onEdit = () => {
        setOpenChallengeSettingsDialog(true);
    }

    const onClose = () => {
        setSelectedOption(undefined);
        setOpenChallengeSettingsDialog(false);
        setOpenDelete(false);
    };
    const onUpdate = () => {
        refetch({page, pageSize});
    };
    const [
        openChallengeSettingsDialog,
        setOpenChallengeSettingsDialog,
    ] = useState(false);

    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    useEffect(() => generateErrorAlert(show, error), [error]);

    useEffect(() => {
        async function fetch() {
            await refetch({page, pageSize})
        }

        fetch();
    }, [page, pageSize]);

    const styles = {
        floatingAction: {
            position: 'absolute',
            bottom: 30,
            right: 30,
            background: '#2b61b3',
        },
    }

    return (
        loading ? <FullPageLoader/> :
            error ? <FullPageError error={error?.message || error?.toString()} />:  <>
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
                            _.map(data?.methodOptions?.options, (option) => {
                                const {name, code, lastUpdated} = option;
                                return (
                                    <TableRow key={`${code}-row`}>
                                        <TableCell>{name}</TableCell>
                                        <TableCell>{code}</TableCell>
                                        <TableCell>{getFormattedDate(lastUpdated)}</TableCell>
                                        <TableCell><Button onClick={(d, e) => {
                                            setSelectedOption(option);
                                            setRef(e?.currentTarget);
                                        }} icon={<MoreHorizIcon/>}/></TableCell>
                                    </TableRow>
                                )
                            })
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

                <Grid item container justify="flex-end">
                    <Fab
                        className="primary.jsx-2371629422"
                        style={styles.floatingAction}
                        color="primary"
                        aria-label="add"
                        onClick={() =>
                            setOpenChallengeSettingsDialog(
                                !openChallengeSettingsDialog
                            )
                        }
                    >
                        <AddIcon/>
                    </Fab>
                </Grid>
                {
                    ref &&
                    <TableActionsMenu roles={{update: true, delete: true}} object={selectedOption} onDelete={onDelete}
                                      onEdit={onEdit} reference={ref}
                                      onClose={_ => setRef(undefined)}/>
                }
                {
                    openDelete && <OptionDeleteConfirmation
                        type='event'
                        message='Are you sure you want to delete this method?'
                        onClose={onClose}
                        option={selectedOption}
                        deletionSuccessMessage='Method Deleted Successfully'
                        onUpdate={onUpdate}
                        optionSet={data?.actionStatusOptionSet}
                    />
                }
                {openChallengeSettingsDialog && (
                    <ChallengeSettingsFormDialog
                        onClose={onClose}
                        onUpdate={onUpdate}
                        method={selectedOption}
                        optionSet={data?.actionStatusOptionSet}
                    />
                )}</>
    )
}
