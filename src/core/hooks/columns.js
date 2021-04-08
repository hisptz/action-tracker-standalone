import {useSetRecoilState} from "recoil";
import {TablesState} from "../states/column";


export default function useColumns(){
    const setColumnState = useSetRecoilState(TablesState);


}
