import {CenteredContent} from '@dhis2/ui'
import React from 'react';
import i18n from '@dhis2/d2-i18n'

export default function NoDimensionsSelectedView() {


    return (
        <CenteredContent>
            <h2 style={{color: '#6E7A8A'}}>{i18n.t('Select organisation unit and period to start')}</h2>
        </CenteredContent>

    )
}
