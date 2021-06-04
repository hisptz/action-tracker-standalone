import Bottleneck from "../../../core/models/bottleneck";
import React, {useEffect, useState} from 'react';
import {Box, Button, CenteredContent, CircularLoader} from '@dhis2/ui';
import {Card, CardContent, Grid, Typography} from "@material-ui/core";
import ChallengeTable from "./Tables/ChallengeTable";
import ProgressIcon from '@material-ui/icons/BarChart';
import {useIndicatorsName} from "../../../core/hooks/indicators";
import {generateErrorAlert} from "../../../core/services/errorHandling.service";
import {useAlert} from "@dhis2/app-runtime";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import TableActionsMenu from "./TableActionsMenu";
import DeleteConfirmation from "../../../shared/Components/DeleteConfirmation";
import ProgressDialog from '../../../shared/Dialogs/ProgressDialog'
import {useRecoilValue} from "recoil";
import {UserRolesState} from "../../../core/states/user";
import Visibility from "../../../shared/Components/Visibility";
import useWindowDimensions from "../../../core/hooks/window";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import i18n from '@dhis2/d2-i18n'
export default function ChallengeCard({
                                          indicator = new Bottleneck(),
                                          refresh,
                                          onEdit,
                                          expandedCardId,
                                          setExpandedCardId
                                      }) {
    const [openProgressDialog, setOpenProgressDialog] = useState(false);
    const indicatorObject = indicator.toJson();
    const {loading, error, name} = useIndicatorsName(indicatorObject.indicator);
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    useEffect(() => generateErrorAlert(show, error), [error]);
    const {bottleneck: bottleneckRoles} = useRecoilValue(UserRolesState) || {};
    const {width} = useWindowDimensions();

    const [ref, setRef] = useState(undefined);
    const [openDelete, setOpenDelete] = useState(false);


    const onDelete = () => {
        setOpenDelete(true);
    }

    return (
        <Box id={`intervention-card-${indicator.id}`} minWidth={'1326px'} maxWidth={`${width - 40}px`}>
            <Card variant='outlined' style={{minHeight: 32}}>
                {

                    <CardContent>
                        {
                            loading ?
                                <CenteredContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Box height='600px' width={'100%'} className='overflow'>
                                                <CenteredContent>
                                                    <CircularLoader small/>
                                                </CenteredContent>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CenteredContent> :
                                <Grid container spacing={2}>
                                    <Grid container direction='row' justify='space-between' item xs={12}>
                                        <Grid item container spacing={4} xs={7}>
                                            <Grid item>
                                                <Typography
                                                    variant='h6'> {indicator.intervention} - {name}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Button onClick={() => setOpenProgressDialog(true)}
                                                        icon={<ProgressIcon/>}>{i18n.t('View Indicator Progress')}</Button>
                                            </Grid>
                                        </Grid>
                                        <Grid item container justify='flex-end' xs={1}>
                                            <Visibility visible={bottleneckRoles.update || bottleneckRoles.delete}>
                                                <Button dataTest="context-menu-button-challenge-card"
                                                        onClick={(d, e) => setRef(e.currentTarget)}
                                                        icon={<MoreHorizIcon/>}/>
                                            </Visibility>
                                            <div style={{paddingLeft: 4}}><Button
                                                onClick={() => expandedCardId === indicator.id ? setExpandedCardId(undefined) : setExpandedCardId(indicator.id)}
                                                icon={expandedCardId === indicator.id ? <ExpandLessIcon/> :
                                                    <ExpandMoreIcon/>}/></div>
                                        </Grid>
                                    </Grid>
                                    {
                                        openProgressDialog && <ProgressDialog indicatorId={indicator?.indicator}
                                                                              onClose={() => setOpenProgressDialog(false)}/>
                                    }
                                    {
                                        expandedCardId === indicator.id &&
                                        <Grid item xs={12}>
                                            <Box width='100%' className='overflow'>
                                                <ChallengeTable indicator={indicatorObject}/>
                                            </Box>
                                        </Grid>
                                    }
                                </Grid>
                        }
                        {
                            ref &&
                            <TableActionsMenu roles={bottleneckRoles} object={indicator} onDelete={onDelete}
                                              onEdit={onEdit}
                                              reference={ref}
                                              onClose={_ => setRef(undefined)}/>
                        }
                        {
                            openDelete && <DeleteConfirmation
                                hasRelationships
                                type='trackedEntityInstance'
                                message={i18n.t('Are you sure you want to delete this intervention and all related solutions and actions?')}
                                onClose={_ => setOpenDelete(false)}
                                id={indicator?.id}
                                deletionSuccessMessage={i18n.t('Intervention Deleted Successfully')}
                                onUpdate={refresh}
                            />
                        }
                    </CardContent>
                }
            </Card>
        </Box>
    )
}
