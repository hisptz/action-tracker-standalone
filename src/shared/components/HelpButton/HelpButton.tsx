import { Step, Steps } from 'intro.js-react'
import { Button, IconQuestion16, IconQuestion24, Tooltip } from '@dhis2/ui'
import React from 'react'
import { useBoolean } from 'usehooks-ts'
import i18n from '@dhis2/d2-i18n'
import classes from './HelpButton.module.css'

export interface HelpButtonProps {
    steps: Step[];
    key: string;
    initialStep?: number
}

export function HelpButton ({ steps, initialStep }: HelpButtonProps) {
    const { value: showHelp, setTrue: onShowHelp, setFalse: onHideHelp } = useBoolean(false)
    return (
        <>
            <Steps

                onComplete={onHideHelp}
                enabled={showHelp}
                initialStep={initialStep ?? 0}
                steps={steps}
                onExit={onHideHelp}
                options={{
                    hideNext: true,
                    doneLabel: i18n.t('Exit')
                }}
            />
            <Button icon={<IconQuestion24/>} onClick={onShowHelp}>{i18n.t('Help')}</Button>
        </>
    )

}

export function HelpIcon ({
                              steps,
                              initialStep
                          }: HelpButtonProps) {
    const {
        value: showHelp,
        setTrue: onShowHelp,
        setFalse: onHideHelp
    } = useBoolean(false)
    return (
        <>
            <Steps

                onComplete={onHideHelp}
                enabled={showHelp}
                initialStep={initialStep ?? 0}
                steps={steps}
                onExit={onHideHelp}
                options={{
                    hideNext: true,
                    doneLabel: i18n.t('Exit')
                }}
            />
            <Tooltip content={i18n.t('View help')}>
                <button className={classes['icon-button']} onClick={onShowHelp}>
                    <IconQuestion16/>
                </button>
            </Tooltip>
        </>
    )

}
