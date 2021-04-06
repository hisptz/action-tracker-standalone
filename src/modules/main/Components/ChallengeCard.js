import Bottleneck from "../../../core/models/bottleneck";
import React, {useEffect, useState} from 'react';
import {Box, Button, CenteredContent, CircularLoader} from '@dhis2/ui';
import {Card, CardContent, Grid, Typography} from "@material-ui/core";
import ChallengeTable from "./Tables/ChallengeTable";
import ProgressIcon from '@material-ui/icons/BarChart';
import {useIndicatorsName} from "../../../core/hooks/indicators";
import generateErrorAlert from "../../../core/services/generateErrorAlert";
import {useAlert} from "@dhis2/app-runtime";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import TableActionsMenu from "./TableActionsMenu";
import DeleteConfirmation from "../../../shared/Components/DeleteConfirmation";
import ProgressDialog from '../../../shared/Dialogs/ProgressDialog'
import {useRecoilValue} from "recoil";
import {UserRolesState} from "../../../core/states/user";
import Visibility from "../../../shared/Components/Visibility";


export default function ChallengeCard({indicator = new Bottleneck(), refresh, onEdit}) {
    const [openProgressDialog, setOpenProgressDialog] = useState(false);
    // const closeProgressDialog = () => setOpenProgressDialog(false)
    const indicatorObject = indicator.toJson();
    const {loading, error, name} = useIndicatorsName(indicatorObject.indicator);
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    useEffect(() => generateErrorAlert(show, error), [error]);
    const {bottleneck: bottleneckRoles} = useRecoilValue(UserRolesState) || {};


    const [ref, setRef] = useState(undefined);
    const [openDelete, setOpenDelete] = useState(false);


    const onDelete = () => {
        setOpenDelete(true);
    }


    return (
        <Grid item sm={12}>
            <Box maxHeight="600px">
                <Card variant='outlined'>
                    <CardContent>
                        {
                            loading ?
                                <CenteredContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Box height='500px' width={'100%'} className='overflow'>
                                                <CenteredContent>
                                                    <CircularLoader small/>
                                                </CenteredContent>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CenteredContent> :
                                <Grid container spacing={2}>
                                    <Grid container direction='row' justify='space-between' item xs={12}>
                                        <Grid item container spacing={4} xs={11}>
                                            <Grid item>
                                                <Typography
                                                    variant='h6'>{name}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Button onClick={() => setOpenProgressDialog(true)} icon={<ProgressIcon/>}>View Progress</Button>
                                            </Grid>
                                        </Grid>
                                        <Grid item container justify='flex-end' xs={1}>
                                            <Visibility visible={bottleneckRoles.update || bottleneckRoles.delete}>
                                                <Button onClick={(d, e) => setRef(e.currentTarget)}
                                                        icon={<MoreHorizIcon/>}/>
                                            </Visibility>
                                        </Grid>
                                    </Grid>
                                    {
                                        openProgressDialog && <ProgressDialog indicatorId={indicator?.indicator} onClose={() => setOpenProgressDialog(false)}/>
                                    }
                                    <Grid item xs={12}>
                                        <Box maxHeight='500px' className='overflow'>
                                            <ChallengeTable indicator={indicatorObject}/>
                                        </Box>
                                    </Grid>
                                </Grid>
                        }
                        {
                            ref && <TableActionsMenu roles={bottleneckRoles} object={indicator} onDelete={onDelete} onEdit={onEdit} reference={ref}
                                                     onClose={_ => setRef(undefined)}/>
                        }
                        {
                            openDelete && <DeleteConfirmation
                                type='trackedEntityInstance'
                                message='Are you sure you want to delete this challenge and all related solutions and actions?'
                                onClose={_ => setOpenDelete(false)}
                                id={indicator?.id}
                                deletionSuccessMessage='Challenge Deleted Successfully'
                                onUpdate={refresh}
                            />
                        }
                    </CardContent>
                </Card>
            </Box>
        </Grid>
    )
}
