import { Template } from '../../modules/GetStarted/components/TemplateCard'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ReactComponent as BasicTracking } from '../../shared/assets/images/basic-tracking.svg'
import { ReactComponent as BNAIcon } from '../../shared/assets/images/bna.svg'
import { generateBasicTemplate, generateLegacyTemplate } from './defaults'

export const configTemplates: Template[] = [
    {
        id: 'basic-tracking',
        title: i18n.t('Basic activity tracking'),
        description: i18n.t('A simple implementation with one level of categorization'),
        icon: <BasicTracking/>,
        configs: [],
        configGenerator: generateBasicTemplate
    },
    {
        id: 'bna-actions-tracking',
        title: i18n.t('BNA linked action tracking'),
        description: i18n.t('Track actions from root causes defined in your BNA app'),
        icon: <BNAIcon/>,
        configs: [],
        configGenerator: generateLegacyTemplate
    }
]
