import {useState} from 'react';
import Paper from '@material-ui/core/Paper';
import SelectionWrapper from '../../shared/Components/SelectionWrapper/SelectionWrapper';
import './styles/FilterComponents.css';
import {FilterComponentTypes} from '../constants';
import PeriodFilter from '../../shared/Components/PeriodFilter';
import OrganisationUnitFilter from '../../shared/Components/OrgUnitFilter';
import Grid from '@material-ui/core/Grid';
import {useRecoilState} from "recoil";
import {DimensionsState} from "../states";
import {Container} from "@material-ui/core";

export function FilterComponents() {
    const [openPeriodFilter, setOpenPeriodFilter] = useState(false);
    const [openOrgUnitFilter, setOrgUnitFilter] = useState(false);
    const [selectedPeriodItems, setSelectedPeriodItems] = useState([]);
    const [selectedDimensions, setSelectedDimensions] = useRecoilState(DimensionsState);

    const onUpdateOrgUnitFilter = (data) => {
        //  console.log({data})
        if (data) {
            setSelectedDimensions((dimensions) => ({...dimensions, orgUnit: data}))
        }
        setOrgUnitFilter(false);
    };

    const onClose = () => console.log("Submitted");

    const onUpdatePeriodFilter = (data) => {
        console.log({data});
        if (data && data.length) {
            const items = data[0] && data[0].items ? data[0].items : [];
            console.log({items})
            setSelectedDimensions((dimensions) => ({...dimensions, period: items}))
        }
        setOpenPeriodFilter(false);
    };

    return (
            <Paper elevation={2}>
                <Container maxWidth='xl' style={{padding: 20}}>
                <Grid container spacing={5} >
                    <Grid item>
                        <SelectionWrapper
                            onClick={(_) => setOrgUnitFilter(true)}
                            dataObj={selectedDimensions?.orgUnit || []}
                            type={FilterComponentTypes.ORG_UNIT}
                        />
                    </Grid>
                    <Grid item>
                        <SelectionWrapper
                            onClick={(_) => setOpenPeriodFilter(true)}
                            type={FilterComponentTypes.PERIOD}
                            periodItems={selectedPeriodItems?.period || []}
                        />
                    </Grid>
                </Grid>


                {openPeriodFilter && (
                    <PeriodFilter
                        onClose={(_) => setOpenPeriodFilter(false)}
                        onUpdate={onUpdatePeriodFilter}
                    />
                )}
                {
                    openOrgUnitFilter &&
                    <OrganisationUnitFilter
                        onClose={(_) => setOrgUnitFilter(false)}
                        onUpdate={onUpdateOrgUnitFilter}
                    />

                }
                {/*{openOrgUnitFilter && (*/}
                {/*    <ActionItemDialog*/}
                {/*        onClose={onClose}*/}
                {/*        onUpdate={onClose}*/}
                {/*    />*/}
                {/*)}*/}
                </Container>
            </Paper>

    );
}

export default FilterComponents;
