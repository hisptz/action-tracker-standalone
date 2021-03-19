import {BOTTLENECK_PROGRAM_ID, ACTION_PROGRAM_ID} from "./config";
import {FilterComponentTypes, Dhis2ValueTypes} from "./constants";
import PROGRAMS from './metadata.json';
import {GAP_PROGRAM_STAGE_ID}  from './gap'
import {POSSIBLE_SOLUTION_PROGRAM_STAGE_ID}  from './possibleSolution'
import {GAP_SOLUTION_LINKAGE, SOLUTION_ACTION_LINKAGE} from './linkages'
import {ACTION_TRACKED_ENTITY_TYPE} from "./action";
import {INDICATOR_ATTRIBUTE} from './bottleneck';

export {
    ACTION_PROGRAM_ID,
    BOTTLENECK_PROGRAM_ID,
    FilterComponentTypes,
    Dhis2ValueTypes,
    PROGRAMS,
    POSSIBLE_SOLUTION_PROGRAM_STAGE_ID,
    GAP_PROGRAM_STAGE_ID,
    GAP_SOLUTION_LINKAGE,
    SOLUTION_ACTION_LINKAGE,
    ACTION_TRACKED_ENTITY_TYPE,
    INDICATOR_ATTRIBUTE
}
