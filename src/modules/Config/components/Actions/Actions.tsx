import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { Divider } from '@dhis2/ui'
import { RHFTextInputField } from '@hisptz/dhis2-ui'
import { ActionFields } from './components/ActionFields'
import { ActionStatusFields } from './components/ActionStatusFields'
import { ActionStatusOptionsConfig } from './components/ActionStatusOptionsConfig'
import { HelpButton, HelpIcon } from '../../../../shared/components/HelpButton'
import { ActionPlanningSteps, ActionSteps, ActionTrackingStatusOptions, ActionTrackingSteps } from './docs/steps'

const namespace = `action`

export function Actions () {
    return (
        <div className="column gap-32">
            <div>
                <div className="row space-between gap-32">
                    <h2 className="m-0">{i18n.t('Action Configuration')}</h2>
                    <HelpButton steps={ActionSteps} key="action-steps"/>
                </div>
                <Divider margin="0"/>
            </div>
            <div style={{ maxWidth: 800 }} className="flex-1  column gap-32">
                <div className="column gap-16 action-config-area">
                    <div className="row gap-8">
                        <h3 className="m-0">{i18n.t('Action Planning')}</h3>
                        <HelpIcon steps={ActionPlanningSteps} key="action-planning-icon-steps"/>
                    </div>
                    <div className="action-name-config-container">
                        <RHFTextInputField
                            required
                            validations={{
                                required: i18n.t('Name is required')
                            }}
                            helpText={i18n.t('This will appear on headings and button labels')}
                            name={`${namespace}.name`} label={i18n.t('Name')}
                        />
                    </div>
                    <ActionFields/>
                </div>
                <div className="column gap-16 action-tracking-config-container">
                    <div className="row gap-8 align-center">
                        <h3 className="m-0">{i18n.t('Action Tracking')}</h3>
                        <HelpIcon steps={ActionTrackingSteps} key="action-tracking-icon-steps"/>
                    </div>
                    <div className="review-date-label-field">
                        <RHFTextInputField
                            required
                            validations={{
                                required: i18n.t('Date label is required')
                            }}
                            name={`${namespace}.statusConfig.dateConfig.name`} label={i18n.t('Date of review label')}
                        />
                    </div>
                    <ActionStatusFields/>
                </div>
                <div className="column gap-16 action-tracking-status-config-container">
                    <div className="row gap-8 align-center">
                        <h4>{i18n.t('Action status options')}</h4>
                        <HelpIcon steps={ActionTrackingStatusOptions} key="action-status-options-steps"/>
                    </div>
                    <ActionStatusOptionsConfig/>
                </div>

            </div>
        </div>
    )
}
