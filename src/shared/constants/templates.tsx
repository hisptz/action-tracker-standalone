import { Template } from '../../modules/GetStarted/components/TemplateCard'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ReactComponent as BasicTracking } from '../../shared/assets/images/basic-tracking.svg'
import { ReactComponent as BNAIcon } from '../../shared/assets/images/bna.svg'
import { generateBasicTemplate, generateLegacyTemplate } from './defaults'
import { Attribute } from '../types/dhis2'
import valueType = Attribute.valueType

export const configTemplates: Template[] = [
    {
        id: 'basic-tracking',
        title: i18n.t('Basic activity tracking'),
        description: i18n.t('A simple implementation with one level of categorization'),
        icon: <BasicTracking/>,
        defaultVariables: {
            name: i18n.t('Basic activity tracking'),
            code: 'BAT'
        },
        variables: [
            {
                label: i18n.t('Name'),
                valueType: valueType.TEXT,
                name: 'name'
            },
            {
                label: i18n.t('Code'),
                valueType: valueType.TEXT,
                name: 'code',
                helpText: i18n.t('Should be at most 10 characters')
            }
        ],
        configGenerator: generateBasicTemplate
    },
    {
        id: 'bna-actions-tracking',
        title: i18n.t('BNA linked action tracking'),
        description: i18n.t('Track actions from root causes defined in your BNA app'),
        icon: <BNAIcon/>,
        variables: [
            {
                label: i18n.t('Name'),
                valueType: valueType.TEXT,
                name: 'name'
            },
            {
                label: i18n.t('Code'),
                valueType: valueType.TEXT,
                name: 'code',
                helpText: i18n.t('Should be at most 10 characters')
            }
        ],
        configGenerator: generateLegacyTemplate
    }
]
