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
import * as _ from "lodash";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import React, {useEffect, useState} from 'react';
import {useAlert, useDataQuery} from "@dhis2/app-runtime";
import {generateErrorAlert} from "../../../../../core/services/errorHandling.service";
import FullPageLoader from "../../../../../shared/Components/FullPageLoader";
import ChallengeMethodConstants from "../constants/optionSets";
import {getFormattedDate} from "../../../../../core/helpers/utils/date.utils";
import Grid from "@material-ui/core/Grid";
import {Fab} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ChallengeSettingsFormDialog from "../../Dialogs/ChallengeSettingsFormDialog";
import TableActionsMenu from "../../../../main/Components/TableActionsMenu";
import {OptionDeleteConfirmation} from "../../../../../shared/Components/DeleteConfirmation";
import FullPageError from "../../../../../shared/Components/FullPageError";
import {BottleneckConstants, GapConstants} from "../../../../../core/constants";
import Visibility from "../../../../../shared/Components/Visibility";
import {useRecoilValue} from "recoil";
import {UserRolesState} from "../../../../../core/states/user";
import i18n from '@dhis2/d2-i18n'


const methodsQuery = {
    methodOptions: {
        resource: 'options',
        params: ({page, pageSize}) => ({
            fields: [
                'code',
                'displayName',
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
        id: ChallengeMethodConstants.CHALLENGE_METHOD_OPTION_SET_ID,
        params: {
            fields: [
                'id',
                'options[name,code,id,sortOrder]',
                'name',
                'displayName',
                'valueType',
                'code'
            ]
        }
    }
}

const columns = [
    i18n.t('Name'),
    i18n.t('Code'),
    i18n.t('Last Updated'),
]

export default function ChallengeMethodsTable() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const {settings} = useRecoilValue(UserRolesState);
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
            bottom: 32,
            right: 32,
            background: '#2b61b3',
        },
    }

    return (
        loading ? <FullPageLoader/> :
            error ? <FullPageError error={error?.message || error?.toString()}/> : <>
                <Table dataTest='challenge-methods-table'>
                    <TableHead>
                        <TableRowHead>
                            {
                                _.map(columns, (column) => <TableCellHead
                                    key={`${column}-action-status`}>{column}</TableCellHead>)
                            }
                            <TableCellHead><Grid item container justify='flex-end'
                                                 direction='row'>{i18n.t('Actions')}</Grid></TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {
                            _.map(data?.methodOptions?.options, (option) => {
                                const { code, lastUpdated, displayName} = option;
                                return (
                                    <TableRow key={`${code}-row`}>
                                        <TableCell>{i18n.t('{{ displayName }}', {displayName})}</TableCell>
                                        <TableCell>{code}</TableCell>
                                        <TableCell>{getFormattedDate(lastUpdated)}</TableCell>
                                        <TableCell><Grid item container justify='flex-end' direction='row'>
                                            <Visibility visible={settings.challengeMethodsOptions}>
                                                <Button dataTest={`challenge-method-menu-${code}`} onClick={(d, e) => {
                                                    setSelectedOption(option);
                                                    setRef(e.currentTarget);
                                                }} icon={<MoreHorizIcon/>}/>
                                            </Visibility>
                                        </Grid></TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                    <TableFoot>
                        <TableRow>
                            <TableCell colSpan={`${columns.length + 1}`}>
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
                    <Visibility visible={settings.challengeMethodsOptions}>
                        <Fab
                            id='add-challenge-method-button'
                            style={styles.floatingAction}
                            aria-label="add"
                            color='primary'
                            onClick={() =>
                                setOpenChallengeSettingsDialog(
                                    !openChallengeSettingsDialog
                                )
                            }
                        >
                            <AddIcon/>
                        </Fab>
                    </Visibility>
                </Grid>
                {
                    ref &&
                    <TableActionsMenu roles={{update: true, delete: true}} object={selectedOption} onDelete={onDelete}
                                      onEdit={onEdit} reference={ref}
                                      onClose={_ => setRef(undefined)}/>
                }
                {
                    openDelete && <OptionDeleteConfirmation
                        dataElement={GapConstants.METHOD_DATA_ELEMENT}
                        program={BottleneckConstants.PROGRAM_ID}
                        type='event'
                        message={i18n.t('Are you sure you want to delete this method? This action cannot be undone.')}
                        onClose={onClose}
                        option={selectedOption}
                        deletionSuccessMessage={i18n.t('Method Deleted Successfully')}
                        cannotDeleteMessage={i18n.t('Cannot delete this method. It has been assigned to one or more interventions.')}
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
