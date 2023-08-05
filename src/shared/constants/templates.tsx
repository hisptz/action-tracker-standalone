import { Template } from '../../modules/GetStarted/components/TemplateCard'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ReactComponent as BasicTracking } from '../../shared/assets/images/basic.svg'
import { ReactComponent as SecondaryTracking } from '../../shared/assets/images/secondary.svg'
import { ReactComponent as TertiaryTracking } from '../../shared/assets/images/basic-tracking.svg'
import { ReactComponent as BNAIcon } from '../../shared/assets/images/bna.svg'
import { generateBasicTemplate, generateLegacyTemplate } from './defaults'
import { Attribute } from '../types/dhis2'
import valueType = Attribute.valueType

export const configTemplates: Template[] = [
    {
        id: 'basic-tracking',
        title: i18n.t('Basic activity tracking'),
        description: i18n.t('Activity tracking model with one level of categorization'),
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
        configGenerator: generateBasicTemplate(1)
    },
    {
        id: 'two-level-tracking',
        title: i18n.t('Secondary activity tracking'),
        description: i18n.t('Activity tracking model with two levels of categorization'),
        icon: <SecondaryTracking/>,
        defaultVariables: {
            name: i18n.t('Secondary activity tracking'),
            code: 'SAT'
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
        configGenerator: generateBasicTemplate(2)
    },
    {
        id: 'three-level-tracking',
        title: i18n.t('Tertiary activity tracking'),
        description: i18n.t('Activity tracking model with three levels of categorization'),
        icon: <TertiaryTracking/>,
        defaultVariables: {
            name: i18n.t('Tertiary activity tracking'),
            code: 'TAT'
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
        configGenerator: generateBasicTemplate(3)
    },
    {
        id: 'bna-actions-tracking',
        title: i18n.t('BNA linked action tracking'),
        description: i18n.t('Use the BNA like categorization to track activities'),
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
        defaultVariables: {
            name: 'BNA action tracking',
            code: 'BNA'
        },
        configGenerator: generateLegacyTemplate
    }
]
