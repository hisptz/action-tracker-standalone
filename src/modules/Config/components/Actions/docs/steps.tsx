import { Step } from 'intro.js-react'
import i18n from '@dhis2/d2-i18n'
import React from 'react'

export const ActionPlanningSteps: Step[] = [
    {
        element: '.action-config-area',
        intro: <>
            <p>{i18n.t('This section allows configuration of action planning data.')}</p>
        </>
    },
    {
        element: '.action-name-config-container',
        intro: <>
            <p>{i18n.t('Here you can modify how your actions are defined in the app. This information will be used in button labels and headings in the app when referring to action.')}</p>
        </>
    },
    {
        element: '.action-field-table-container',
        intro: <>
            <p>{i18n.t('Here you can define what information to collect for action planning. Each of the field defined here will appear in the data entry form of action. Currently supported field types include text, long text, number, and date')}</p>
        </>
    },
    {
        element: 'td[data-test=\'field-table-action\']',
        intro: <>
            <p>{i18n.t('You can edit and delete fields here.')}</p>
        </>
    },
    {
        element: 'div[data-test=\'field-add-button\']',
        intro: <>
            <p>{i18n.t('You can add a new field by clicking here. There are 2 ways to add a field. You can select an existing field (from DHIS2 metadata) or you can add a completely new field.')}</p>
        </>
    }
]

export const ActionTrackingSteps: Step[] = [
    {
        element: '.action-tracking-config-container',
        intro: <>
            <p>{i18n.t('This section allows configuration of tracking data. ')}</p>
        </>
    },
    {
        element: '.review-date-label-field',
        intro: <>
            <p>{i18n.t('Each action tracking update must have a date. This field allows you to configure the label for the date field for the form and display in the tracking table.')}</p>
        </>
    },
    {
        element: '.action-status-field-table-container',
        intro: <>
            <p>{i18n.t('Here you can define what information to collect for actions in tracking. Each of the field defined here will appear in the data entry form of action tracking update. Currently supported field types include text, long text, number, and date')}</p>
        </>
    },
]

export const ActionTrackingStatusOptions: Step[] = [
    {
        element: '.action-tracking-status-config-container',
        intro: <>
            <p>{i18n.t('Each action tracking entry must have a status. The status field is an option set field whose options can be configured in this section. Here you can add, remove or update the options')}</p>
        </>
    },
    {
        element: 'td[data-test=\'action-status-options-cell\']',
        intro: <>
            <p>{i18n.t('You can edit or delete an option by clicking here')}</p>
        </>
    },
    {
        element: 'button[data-test=\'action-status-option-add-btn\']',
        intro: <>
            <p>{i18n.t('You can add a new option by clicking here')}</p>
        </>
    }
]

export const ActionSteps: Step[] = [
    {
        title: i18n.t('Action planning and tracking configuration'),
        intro: <>
            <p>{i18n.t('In this page you can configure what information to record when adding actions/activities. You can also define what information to collect when adding tracking information for an action.')}</p>
        </>
    },
    ...ActionPlanningSteps
]
