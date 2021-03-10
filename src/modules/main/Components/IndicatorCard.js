import Indicator from "../../../core/models/indicator";
import React, {useEffect} from 'react';
import {Box} from '@dhis2/ui';
import {Card, CardContent, Grid, Typography} from "@material-ui/core";
import IndicatorTable from "./Tables/IndicatorTable";

export default function IndicatorCard({indicator = new Indicator()}) {

    const indicatorObject = {
        name: 'Indicator Name',
        gaps: [
            {
                title: 'Gap 1',
                description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
                solutions: [
                    {
                        solution: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\',',
                        actions: [
                            {
                                description: 'ong established fact that a reader will be distracted by the readable content ',
                                responsiblePerson: 'Gift Nnko',
                                designation: 'Officer',
                                startDate: " 09/03/2010",
                                endDate: '04/07/2021',
                                status: 'In Progress'
                            },
                            {
                                description: 'ong established fact that a reader will be distracted by the readable content ',
                                responsiblePerson: 'Gift Nnko',
                                designation: 'Officer',
                                startDate: " 09/03/2010",
                                endDate: '04/07/2021',
                                status: 'In Progress'
                            },
                        ]
                    },
                    {
                        solution: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\',',
                        actions: [
                            {
                                description: 'ong established fact that a reader will be distracted by the readable content ',
                                responsiblePerson: 'Gift Nnko',
                                designation: 'Officer',
                                startDate: " 09/03/2010",
                                endDate: '04/07/2021',
                                status: 'In Progress'
                            }
                        ]
                    },
                    {
                        solution: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\',',
                        actions: [
                            {
                                description: 'ong established fact that a reader will be distracted by the readable content ',
                                responsiblePerson: 'Gift Nnko',
                                designation: 'Officer',
                                startDate: " 09/03/2010",
                                endDate: '04/07/2021',
                                status: 'In Progress'
                            }
                        ]
                    },
                    {
                        solution: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\',',
                        actions: [
                            {
                                description: 'ong established fact that a reader will be distracted by the readable content ',
                                responsiblePerson: 'Gift Nnko',
                                designation: 'Officer',
                                startDate: " 09/03/2010",
                                endDate: '04/07/2021',
                                status: 'In Progress'
                            }
                        ]
                    },


                ]
            },
            {
                title: 'Gap 2',
                description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
                solutions: [
                    {
                        solution: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\',',
                        actions: [
                            {
                                description: 'ong established fact that a reader will be distracted by the readable content ',
                                responsiblePerson: 'Gift Nnko',
                                designation: 'Officer',
                                startDate: " 09/03/2010",
                                endDate: '04/07/2021',
                                status: 'In Progress'
                            },
                            {
                                description: 'ong established fact that a reader will be distracted by the readable content ',
                                responsiblePerson: 'Gift Nnko',
                                designation: 'Officer',
                                startDate: " 09/03/2010",
                                endDate: '04/07/2021',
                                status: 'In Progress'
                            },
                            {
                                description: 'ong established fact that a reader will be distracted by the readable content ',
                                responsiblePerson: 'Gift Nnko',
                                designation: 'Officer',
                                startDate: " 09/03/2010",
                                endDate: '04/07/2021',
                                status: 'In Progress'
                            },
                            {
                                description: 'ong established fact that a reader will be distracted by the readable content ',
                                responsiblePerson: 'Gift Nnko',
                                designation: 'Officer',
                                startDate: " 09/03/2010",
                                endDate: '04/07/2021',
                                status: 'In Progress'
                            },

                        ]
                    },
                    {
                        solution: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\',',
                        actions: [
                            {
                                description: 'ong established fact that a reader will be distracted by the readable content ',
                                responsiblePerson: 'Gift Nnko',
                                designation: 'Officer',
                                startDate: " 09/03/2010",
                                endDate: '04/07/2021',
                                status: 'In Progress'
                            }
                        ]
                    },
                    {
                        solution: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\',',
                        actions: [
                            {
                                description: 'ong established fact that a reader will be distracted by the readable content ',
                                responsiblePerson: 'Gift Nnko',
                                designation: 'Officer',
                                startDate: " 09/03/2010",
                                endDate: '04/07/2021',
                                status: 'In Progress'
                            }
                        ]
                    },
                    {
                        solution: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\',',
                        actions: [
                            {
                                description: 'ong established fact that a reader will be distracted by the readable content ',
                                responsiblePerson: 'Gift Nnko',
                                designation: 'Officer',
                                startDate: " 09/03/2010",
                                endDate: '04/07/2021',
                                status: 'In Progress'
                            }
                        ]
                    },


                ]
            },
        ]
    }

    return (
        <Grid item sm={12}>
            <Box height="600px">
                <Card variant='outlined'>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant='h6'>Indicator Name</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Box height='500px' className='overflow'>
                                    <IndicatorTable indicator={indicatorObject}/>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Grid>
    )
}
