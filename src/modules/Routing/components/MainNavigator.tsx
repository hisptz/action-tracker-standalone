import React, {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {FullPageLoader} from "../../../shared/components/Loaders";
import {head, isEmpty} from "lodash";
import {useConfigurations} from "../../../shared/hooks/config";


export function MainNavigator() {
    const navigate = useNavigate();
    const {loading, configs} = useConfigurations()

    useEffect(() => {
        if (configs) {
            if (!isEmpty(configs)) {
                navigate(`/${head(configs)}?type=planning`)
            } else {
                navigate(`/welcome`)
            }
        }
    }, [configs])

    return <FullPageLoader/>
}
