import {Button, Modal, ModalActions, ModalContent, ModalTitle} from '@dhis2/ui'
import React from 'react'
import i18n from '@dhis2/d2-i18n'

export default function ImageViewerModal({onClose, actionStatus}) {

    return (
        <Modal large position="middle" onClose={onClose}>
            <ModalTitle>{`${i18n.t("Task Status")}: ${new Date(actionStatus.reviewDate).toLocaleDateString('en-GB')}`}</ModalTitle>
            <ModalContent>
                <img width={"100%"} src={actionStatus.imageLink} alt="task-status-image"/>
            </ModalContent>
            <ModalActions>
                <Button primary onClick={onClose}>{i18n.t("Close")}</Button>
            </ModalActions>
        </Modal>
    )
}
