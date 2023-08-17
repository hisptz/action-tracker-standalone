import { Card, colors } from '@dhis2/ui'
import classes from '../../GetStarted.module.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Config } from '../../../../shared/schemas/config'
import { RHFDHIS2FormFieldProps } from '@hisptz/dhis2-ui'
import { DataEngine } from '../../../../shared/types/engine'
import { z } from 'zod'

export interface Template {
    id: string;
    icon: React.ReactNode,
    description: string;
    title: string;
    variables?: RHFDHIS2FormFieldProps[],
    defaultVariables?: Record<string, any>;
    configGenerator: (variables?: any) => Config,
    validationGenerator?: (deps: { engine: DataEngine }) => z.ZodObject<any>
}

export interface TemplateCardProps {
    template: Template;
}

export default function TemplateCard ({ template }: TemplateCardProps) {
    const navigate = useNavigate()
    const onClick = (id: string) => () => {
        navigate(`${id}`)
    }

    return (
        <div style={{
            width: 240,
            height: 240
        }}>
            <button onClick={onClick(template.id)} key={`${template.id}-button`}
                    style={{ border: `1px solid ${colors.grey400}` }}
                    className={classes['button']}>
                <Card>
                    <div style={{
                        margin: 'auto',
                        height: 'calc(100% - 16px)'
                    }} className="column align-center center p-8 gap-32">
                        <div className={classes.icon}>
                            {template.icon}
                        </div>
                        <div style={{
                            overflowWrap: 'break-word',
                            whiteSpace: 'normal'
                        }} className="text-center w-100 column gap-8">
                            <h4 className="m-0"
                                style={{ color: colors.grey800 }}>{template.title}</h4>
                            <span style={{
                                color: colors.grey600,
                                fontSize: 14
                            }}>{template.description}</span>
                        </div>
                    </div>
                </Card>
            </button>
        </div>
    )
}
