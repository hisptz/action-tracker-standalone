import React, { useMemo } from 'react'
import { Button, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui'
import { Event, TrackedEntity } from '../../types/dhis2'
import { ActionConfig, ActionStatusConfig, CategoryConfig, DataField } from '../../schemas/config'
import { compact, fromPairs } from 'lodash'
import i18n from '@dhis2/d2-i18n'
import { OptionView } from './components/OptionSetView'

export interface ViewModalProps {
    hide: boolean;
    onClose: () => void;
    instance: TrackedEntity | Event,
    instanceConfig: CategoryConfig | ActionConfig | ActionStatusConfig,
    content?: React.ReactNode
}

export function ViewModal ({
                               hide,
                               onClose,
                               instance,
                               instanceConfig,
                               content
                           }: ViewModalProps) {

    const dataValues = useMemo(() => {
        if ((instance as TrackedEntity)?.attributes) {
            return fromPairs((instance as TrackedEntity).attributes.map(({
                                                                             attribute,
                                                                             value
                                                                         }) => ([attribute, value])))
        } else {
            return fromPairs((instance as Event).dataValues?.map(({
                                                                      dataElement,
                                                                      value
                                                                  }) => ([dataElement, value])))
        }
    }, [instance])

    const dataView = compact(instanceConfig.fields.map((field) => {
        if (field.hidden) {
            return
        }

        return {
            ...field,
            value: dataValues[field.id],
        }
    }))

    const getViewType = (field: DataField & { value: string }) => {
        if (field.optionSet?.id) {
            return <OptionView field={field} value={field.value} instanceConfig={instanceConfig}/>
        }

        switch (field.type) {
            case 'TEXT':
            case 'LONG_TEXT':
                return field.value
            default:
                return field.value
        }
    }

    return (
        <Modal position="middle" hide={hide} onClose={onClose}>
            <ModalTitle>
                {instanceConfig.name} {i18n.t('Details')}
            </ModalTitle>
            <ModalContent>
                {
                    content ? { content } : <div className="column gap-16">
                        {
                            dataView.map((data) => {
                                return (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 2fr'
                                    }}>
                                        <b>{data.name}</b>
                                        <span>{getViewType(data)}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </ModalContent>
            <ModalActions>
                <Button onClick={onClose}>
                    {i18n.t('Close')}
                </Button>
            </ModalActions>
        </Modal>
    )
}
