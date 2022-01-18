import React, {Suspense} from 'react';
import ChallengeList from "./Components/ChallengeList";
import FilterComponents from "./Components/FilterComponents";
import FullPageLoader from "../../shared/Components/FullPageLoader";
import './styles/main.css';
import classes from './main.module.css'
import useAllConfig, {useDataStoreSettings} from "../../core/hooks/config";
import FullPageError from "../../shared/Components/FullPageError";
import NoConfigPage from "./Components/NoConfigPage";


export default function MainPage() {
    const {loading, error, noConfig, firstTimeUseLoading} = useAllConfig()
    useDataStoreSettings()
    return (
        <div className={classes.container}>
            {
                loading &&
                <FullPageLoader text={firstTimeUseLoading && 'Configuring for first time use. Please wait...'}/>
            }
            {
                error && <FullPageError error={error}/>
            }
            {
                noConfig && <NoConfigPage/>
            }
            {
                (!loading && !firstTimeUseLoading && !error && !noConfig) &&
                <Suspense fallback={<FullPageLoader/>}>
                    <div className={classes['filter-container']}><FilterComponents/></div>
                    <div className={classes['data-container']}><ChallengeList/></div>
                </Suspense>
            }
        </div>
    )

}
