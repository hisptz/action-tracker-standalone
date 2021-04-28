import {useDataQuery} from "@dhis2/app-runtime";
import {useSetRecoilState} from "recoil";
import {UserState} from "../states/user";
import {useEffect} from "react";

const userQuery = {
    user:{
        resource: 'me',
        params:{
            fields: [
                'id',
                'name',
                'displayName',
                'userCredentials[userRoles[id,name]]',
                'authorities'
            ]
        }
    }
}

export default function useUser(){
    const {loading, data, error} = useDataQuery(userQuery);
    const setUser = useSetRecoilState(UserState);

    useEffect(() => {
        setUser(data?.user);
    }, [data]);

    return {loading, error};
}
