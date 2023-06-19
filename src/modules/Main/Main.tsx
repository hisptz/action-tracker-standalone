import React from "react"
import {DimensionFilterArea} from "./components/DimensionFilterArea";
import {Header} from "./components/Header/Header";
import {MainArea} from "./components/MainArea";
import {useConfiguration} from "../../shared/hooks/config";
import {FullPageLoader} from "../../shared/components/Loaders";
import {useMetadata} from "../../shared/hooks/metadata";

export function Main() {
    const {loading} = useConfiguration();
    const {loading: loadingMetadata} = useMetadata();

    if (loading && loadingMetadata) {
        return <FullPageLoader/>
    }

    return (
        <div className="column w-100 h-100 gap-16">
            <DimensionFilterArea/>
            <div className="ph-16">
                <Header/>
            </div>
            <div style={{flexGrow: 1}}>
                <MainArea/>
            </div>
        </div>
    )
}
