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
import ActionStatusOptionSetConstants from "../constants/actionStatus";
import {useAlert, useDataQuery} from "@dhis2/app-runtime";
import generateErrorAlert from "../../../../../core/services/generateErrorAlert";
import FullPageLoader from "../../../../../shared/Components/FullPageLoader";
import DHIS2Icon from "../../../../../shared/Components/DHIS2Icon";
import ActionStatusColor from "./ActionStatusColor";
import {getFormattedDate} from "../../../../../core/helpers/utils";
import TableActionsMenu from "../../../../main/Components/TableActionsMenu";
import {OptionDeleteConfirmation} from "../../../../../shared/Components/DeleteConfirmation";
import Grid from "@material-ui/core/Grid";
import {Fab} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ActionStatusSettingsFormDialog from "../../Dialogs/ActionStatusSettingsFormDialog";
import FullPageError from "../../../../../shared/Components/FullPageError";
import {ActionConstants, ActionStatusConstants} from "../../../../../core/constants";
import {useRecoilValue} from "recoil";
import {UserRolesState} from "../../../../../core/states/user";
import Visibility from "../../../../../shared/Components/Visibility";


const actionStatusOptionsQuery = {
    actionStatusOptions: {
        resource: 'options',
        params: ({page, pageSize}) => ({
            page,
            pageSize,
            totalPages: true,
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
                `optionSet.id:eq:${ActionStatusOptionSetConstants.ACTION_STATUS_OPTION_SET_ID}`
            ]
        })
    },
    actionStatusOptionSet: {
        resource: 'optionSets',
        id: ActionStatusOptionSetConstants.ACTION_STATUS_OPTION_SET_ID,
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
    'Color',
    'Icon',
    'Last Updated',
    'Actions'
]

export default function ActionStatusTable() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const {settings} = useRecoilValue(UserRolesState);
    const {loading, data, error, refetch} = useDataQuery(actionStatusOptionsQuery, {
        variables: {page, pageSize},
    });
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    useEffect(() => generateErrorAlert(show, error), [error]);

    const onClose = () => {
        setSelectedOption(undefined);
        setOpenActionStatusSettingsDialog(false);
        setOpenDelete(false);
    };
    const onUpdate = () => {
        refetch({page, pageSize})
    };
    const [
        openActionStatusSettingsDialog,
        setOpenActionStatusSettingsDialog,
    ] = useState(false);

    const [ref, setRef] = useState(undefined);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedOption, setSelectedOption] = useState();

    const onDelete = () => {
        setOpenDelete(true);
    }

    const onEdit = () => {
        setOpenActionStatusSettingsDialog(true);
    }



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
            right: 16,
            background: '#2b61b3',
        },
    }

    return (
        loading ? <FullPageLoader/> :
            error ? <FullPageError error={error.message || error.toString()} />: <>
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
                            _.map(data?.actionStatusOptions?.options, (option) => {
                                const {name, code, style, lastUpdated} = option;
                                return (
                                    <TableRow key={`${code}-row`}>
                                        <TableCell>{name}</TableCell>
                                        <TableCell>{code}</TableCell>
                                        <TableCell><ActionStatusColor color={style?.color}/></TableCell>
                                        <TableCell><DHIS2Icon iconName={style?.icon} size={20}/></TableCell>
                                        <TableCell>{getFormattedDate(lastUpdated)}</TableCell>
                                        <TableCell><Visibility visible={settings.actionStatusOptions}>
                                            <Button onClick={(d, e) => {
                                                setSelectedOption(option);
                                                setRef(e.currentTarget);
                                            }} icon={<MoreHorizIcon/>}/>
                                        </Visibility>
                                        </TableCell>
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
                                    {...data?.actionStatusOptions?.pager}
                                />
                            </TableCell>
                        </TableRow>
                    </TableFoot>
                </Table>
                <Grid item container justify="flex-end">
                   <Visibility visible={settings.actionStatusOptions}>
                       <Fab
                           onClick={() =>
                               setOpenActionStatusSettingsDialog(
                                   !openActionStatusSettingsDialog
                               )
                           }
                           className="primary.jsx-2371629422"
                           style={styles.floatingAction}
                           color="primary"
                           aria-label="add"
                       >
                           <AddIcon/>
                       </Fab>
                   </Visibility>
                    {openActionStatusSettingsDialog && (
                        <ActionStatusSettingsFormDialog
                            optionSet={data?.actionStatusOptionSet}
                            onClose={onClose}
                            onUpdate={onUpdate}
                            actionStatusOption={selectedOption}
                        />
                    )}
                </Grid>
                {
                    ref &&
                    <TableActionsMenu roles={{update: true, delete: true}} object={selectedOption} onDelete={onDelete}
                                      onEdit={onEdit} reference={ref}
                                      onClose={_ => setRef(undefined)}/>
                }
                {
                    openDelete && <OptionDeleteConfirmation
                        dataElement={ActionStatusConstants.STATUS_DATA_ELEMENT}
                        program={ActionConstants.PROGRAM_ID}
                        message='Are you sure you want to delete this action status option?'
                        onClose={onClose}
                        option={selectedOption}
                        optionSet={data?.actionStatusOptionSet}
                        deletionSuccessMessage='Action status option deleted Successfully'
                        onUpdate={onUpdate}
                    />
                }
            </>
    )
}
