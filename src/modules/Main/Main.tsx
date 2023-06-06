import React from "react"
import {DATASTORE_NAMESPACE} from "../../shared/constants/meta";

const query = {
    config: {
        resource: `dataStore/${DATASTORE_NAMESPACE}`,
        id: ({id}: any) => id,
    }
}

export function Main() {


    return (
        <div className="column w-100 h-100 center align-center">
            <h1>Main</h1>
        </div>
    )
}
