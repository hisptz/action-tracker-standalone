import Paper from '@material-ui/core/Paper';
import SelectionWrapper from '../../shared/Components/SelectionWrapper/SelectionWrapper';
import './styles/FilterComponents.css';
import {FilterComponentTypes} from '../constants/Constants';

function FilterComponents() {

    return (
        <Paper className="components-container" elevation={2} >
            <SelectionWrapper type={FilterComponentTypes.ORG_UNIT} />
            <SelectionWrapper type={FilterComponentTypes.PERIOD} />
        </Paper>
    )
}

export default FilterComponents
