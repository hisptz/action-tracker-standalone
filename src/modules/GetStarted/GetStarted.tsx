import React from 'react'
import i18n from '@dhis2/d2-i18n'
import appLogo from '../../shared/assets/images/app-logo.png'
import TemplateCard from './components/TemplateCard/TemplateCard'
import { configTemplates } from '../../shared/constants/templates'

export function GetStarted () {

    return (
        <div className="column align-center center w-100 h-100 gap-16">
            <img alt={i18n.t('app logo')} width={100} src={appLogo}/>
            <h1 className="m-0">{i18n.t('Welcome to the Standalone Action Tracker')}</h1>
            <span>{i18n.t('How would you like to use your action tracker?')}</span>
            <div style={{ flexWrap: 'wrap' }} className="row gap-32 center">
                {
                    configTemplates.map((template) => (
                        <TemplateCard key={`${template.title}-card`} template={template}/>))
                }
            </div>
        </div>
    )
}
