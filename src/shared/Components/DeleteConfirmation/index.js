import {
    Button,
    ButtonStrip,
    CenteredContent,
    CircularLoader,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle
} from '@dhis2/ui';
import {useAlert, useDataEngine, useDataMutation, useDataQuery} from "@dhis2/app-runtime";
import useOptionsMutation from "../../../modules/admin/hooks/option";
import i18n from '@dhis2/d2-i18n'
import {useState} from "react";


const teiDeleteMutation = {
    type: 'delete',
    resource: 'trackedEntityInstances',
    id: ({id}) => id,
}
const eventDeleteMutation = {
    type: 'delete',
    resource: 'events',
    id: ({id}) => id,
}

const relationshipQuery = {
    relationships: {
        resource: 'relationships',
        params: ({tei}) => ({
            tei,
            fields: [
                'relationship',
                'from[trackedEntityInstance[trackedEntityInstance]]',
                'to[trackedEntityInstance[trackedEntityInstance]]',
            ]
        })
    }
}

const relatedTeiDeleteMutation = {
    type: 'create', //To send a POST request
    resource: 'trackedEntityInstances',
    data: ({data}) => data,
    params: {
        strategy: 'DELETE'
    }
}

async function deleteRelatedTeis(engine, id) {
    const {relationships} = await engine.query(relationshipQuery, {variables: {tei: id}})
    const teisToBeDeleted = relationships.map(tei => ({trackedEntityInstance: _.get(tei, ['to', 'trackedEntityInstance', 'trackedEntityInstance'])}))
    console.log(teisToBeDeleted);
    return await engine.mutate(relatedTeiDeleteMutation, {
        variables: {
            data: {
                trackedEntityInstances: teisToBeDeleted
            }
        }
    })
}

export default function DeleteConfirmation({
                                               onClose,
                                               id,
                                               type,
                                               message,
                                               onUpdate,
                                               deletionSuccessMessage,
                                               hasRelationships
                                           }) {
    const [deletingRelatedTeis, setDeletingRelatedTeis] = useState(false);
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    const engine = useDataEngine();
    const [mutate, {
        loading,
    }] = useDataMutation(type === 'trackedEntityInstance' ? teiDeleteMutation : eventDeleteMutation, {
        variables: {
            id
        },
        onComplete: () => {
            show({message: deletionSuccessMessage || i18n.t('Entity deleted successfully'), type: {success: true}})
            onUpdate();
            onClose();
        },
        onError: error => {
            show({message: error?.message || error.toString()})
        }
    })

    const onDeleteConfirm = async () => {
        if (hasRelationships) {
            setDeletingRelatedTeis(true);
            await deleteRelatedTeis(engine, id)
            setDeletingRelatedTeis(false);
        }
        mutate({id})
    }

    return (
        <Modal onClose={onClose}>
            <ModalTitle dataTest='delete-confirmation-modal'>
                {i18n.t('Confirm Delete')}
            </ModalTitle>
            <ModalContent>
                <CenteredContent>
                    <div style={{textAlign: 'center'}}>
                        {message || i18n.t('Are you sure you want to delete this entity?')}
                    </div>
                </CenteredContent>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>{i18n.t('Cancel')}</Button>
                    <Button disabled={loading || deletingRelatedTeis} onClick={onDeleteConfirm}
                            destructive>{loading || deletingRelatedTeis ? i18n.t('Deleting...') : i18n.t('Delete')}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}


const eventQuery = {
    events: {
        resource: 'events',
        params: ({optionCode, program, dataElement}) => ({
            program: `${program}`,
            filter: [
                `${dataElement}:eq:${optionCode}`
            ],
            fields: [
                'event'
            ]
        })
    }
}

export function OptionDeleteConfirmation({
                                             onClose,
                                             option,
                                             message,
                                             onUpdate,
                                             deletionSuccessMessage,
                                             optionSet,
                                             program,
                                             dataElement,
                                             cannotDeleteMessage
                                         }) {
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}));
    const {loading: loadingEvents, error, data} = useDataQuery(eventQuery, {
        variables: {
            program,
            dataElement,
            optionCode: option?.code
        }
    });
    const {loading, mutate} = useOptionsMutation('delete', optionSet, {
        onComplete: () => {
            show({message: deletionSuccessMessage || i18n.t('Entity deleted successfully'), type: {success: true}})
            onUpdate();
            onClose();
        },
        onError: error => {
            show({
                message: i18n.t('{{ message }}', {message: error?.message || error.toString()}),
                type: {critical: true}
            })
        }
    })

    const onDeleteConfirm = () => {
        mutate({id: option.id});
    }
    return (
        <Modal onClose={onClose}>
            <ModalTitle>
                {i18n.t('Confirm Delete')}
            </ModalTitle>
            <ModalContent>
                <CenteredContent>
                    {
                        loadingEvents ? <CircularLoader small/> :
                            _.isEmpty(data?.events?.events) ? <div style={{textAlign: 'center'}}>
                                {message || i18n.t('Are you sure you want to delete this entity? This action cannot be undone')}
                            </div> : <div style={{textAlign: 'center'}}>
                                {cannotDeleteMessage || i18n.t('This option cannot be deleted. It is already used in documented entities.')}
                            </div>
                    }
                </CenteredContent>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button disabled={loadingEvents || !_.isEmpty(data?.events?.events)} onClick={onDeleteConfirm}
                            destructive>{loading ? i18n.t('Deleting...') : i18n.t('Delete')}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
