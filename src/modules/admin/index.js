import {CenteredContent, Button} from '@dhis2/ui';
import React from 'react';
import {useHistory} from "react-router-dom";

export default function AdminPage() {
    const history = useHistory();
    return (
        <CenteredContent>
            <h1>Admin's Page</h1>
            <Button onClick={_ => history.goBack()}>Back</Button>
        </CenteredContent>
    )
}
