import React from 'react'
import {useAlerts} from '@dhis2/app-runtime'
 const Alerts = () => {
    const alerts = useAlerts()
    console.log({alerts});

    return alerts.map(alert => (
        <div key={alert.id}>
            {alert.message}
            <button onClick={alert.remove}>hide</button>
        </div>
    ))
}
export default Alerts

