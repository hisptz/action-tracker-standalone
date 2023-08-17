import { Step } from 'intro.js-react'
import i18n from '@dhis2/d2-i18n'
import React from 'react'

export const OrgUnitAccessSteps: Step[] = [
    {
        element: 'div[data-test=\'org-unit-access\']',
        title: i18n.t('Organisation unit access'),
        intro: <>
            <p>{i18n.t('Here you can define the specific organisation units you want to allow planning and tracking.')}</p>
            <p>{i18n.t('To select an organisation click on the checkbox. You can also click on a checked box to un-select an organisation unit')}</p>
        </>
    },
    {
        element: 'div[data-test=\'org-unit-level-access-selector\']',
        title: i18n.t('Organisation unit selection by level'),
        intro: <>
            <p>{i18n.t('To select all organisation units in a level, choose the level from this selector and click select. To unselect all organisation units in the level click on deselect')}</p>
        </>
    },
    {
        element: 'div[data-test=\'org-unit-group-access-selector\']',
        title: i18n.t('Organisation unit selection by group'),
        intro: <>
            <p>{i18n.t('To select all organisation units in a group, choose the group from this selector and click select. To unselect all organisation units in the group click on deselect')}</p>
        </>
    },
    {
        element: 'input[placeholder=\'Search name, id\']',
        title: i18n.t('Searching organisation unit'),
        intro: <p>
            {i18n.t('You can also search for a specific organisation unit here')}
        </p>
    }

]

export const OrgUnitPlanningSteps: Step[] = []

export const GeneralSteps = [
    ...OrgUnitAccessSteps
]
