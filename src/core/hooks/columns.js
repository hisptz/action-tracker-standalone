import {useSetRecoilState} from "recoil";
import {ColumnState} from "../states/column";


export default function useColumns(){
    const setColumnState = useSetRecoilState(ColumnState);


}
