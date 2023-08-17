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

export const OrgUnitPlanningSteps: Step[] = [
    {
        element: 'div[data-test=\'org-unit-planning-config-container\']',
        title: i18n.t('Planning organisation unit level configuration'),
        intro: <div>
            <p>{i18n.t('Here you can configure planning and tracking to be limited to only some of the organisation unit levels. This means the organisation unit selectors will be limited to only organisation units in this level')}</p>
            <p>{i18n.t('To enable, click on the checkbox and then select an organisation unit level in the select field')}</p>
            <p>{i18n.t('To disable this feature. uncheck the checkbox. With the checkbox unchecked, organisation unit selectors will allow selection for all organisation units')}</p>
        </div>
    }
]

export const OrgUnitDefaultSteps: Step[] = [
    {
        element: '#org-unit-default-config-field-container',
        title: i18n.t('Default organisation unit'),
        intro:
            <p>{i18n.t('Here you can set the default organisation unit. This will be the pre-selected organisation unit whenever the application starts')}</p>
    },
]

export const GeneralSteps = [
    ...OrgUnitAccessSteps,
    ...OrgUnitPlanningSteps,
    ...OrgUnitDefaultSteps
]
