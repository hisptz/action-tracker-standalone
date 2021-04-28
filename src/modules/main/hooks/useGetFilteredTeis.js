import {useState, useEffect} from "react";
import {ActionConstants} from "../../../core/constants";
import {useRecoilValue} from "recoil";
import {DataEngineState} from "../../../core/states";
import Action from "../../../core/models/action";

const actionFilterQuery = {
    filteredActions: {
        resource: 'trackedEntityInstances',
        params: ({ou}) => ({
            program: ActionConstants.PROGRAM_ID,
            ou,
            fields: ActionConstants.ACTION_QUERY_FIELDS
        })
    }
}

export default function useGetFilteredTeis(selectedStatus = '', orgUnit) {
    const [filteredTeis, setFilteredTeis] = useState([]);
    const engine = useRecoilValue(DataEngineState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        async function fetch() {
            if (selectedStatus) {
                try {
                    setLoading(true)
                    const {filteredActions} = await engine.query(actionFilterQuery, {variables: {ou: orgUnit?.id}}) || [];
                    const actions = _.map(filteredActions?.trackedEntityInstances, (actionTei) => new Action(actionTei));
                    setFilteredTeis(_.uniq(_.map(_.filter(actions, (action = new Action()) => action?.latestStatus === selectedStatus), action => action?.challengeId)))
                    setLoading(false)
                } catch (e) {
                    setError(e);
                }
            } else {
                setFilteredTeis([]);
            }
        }
        fetch();
    }, [selectedStatus])

    return {filteredTeis, loading, error}
}
