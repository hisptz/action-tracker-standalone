import {useSetRecoilState} from "recoil";
import {PeriodConfigState} from "../states/config";
import {useDataStore} from "@dhis2/app-service-datastore";


export default function useGetPeriodConfig(){
    const setPeriodConfig = useSetRecoilState(PeriodConfigState)
    const dataStore = useDataStore();
}
