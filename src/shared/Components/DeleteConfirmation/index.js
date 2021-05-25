import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    ButtonStrip,
    CenteredContent,
    CircularLoader
} from '@dhis2/ui';
import {useAlert, useDataMutation, useDataQuery} from "@dhis2/app-runtime";
import useOptionsMutation from "../../../modules/admin/hooks/option";


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


export default function DeleteConfirmation({onClose, id, type, message, onUpdate, deletionSuccessMessage}) {
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))

    const [mutate, {
        loading,
    }] = useDataMutation(type === 'trackedEntityInstance' ? teiDeleteMutation : eventDeleteMutation, {
        variables: {
            id
        },
        onComplete: () => {
            show({message: deletionSuccessMessage || 'Entity deleted successfully', type: {success: true}})
            onUpdate();
            onClose();
        },
        onError: error => {
            show({message: error?.message || error.toString()})
        }
    })

    const onDeleteConfirm = () => {
        mutate({id});
    }

    return (
        <Modal  onClose={onClose}>
            <ModalTitle dataTest='delete-confirmation-modal'>
                Confirm Delete
            </ModalTitle>
            <ModalContent>
                <CenteredContent>
                    <div style={{textAlign: 'center'}}>
                        {message || 'Are you sure you want to delete this entity?'}
                    </div>
                </CenteredContent>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={onDeleteConfirm} destructive>{loading ? 'Deleting...' : 'Delete'}</Button>
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
            optionCode: option.code
        }
    });
    const {loading, mutate} = useOptionsMutation('delete', optionSet, {
        onComplete: () => {
            show({message: deletionSuccessMessage || 'Entity deleted successfully', type: {success: true}})
            onUpdate();
            onClose();
        },
        onError: error => {
            show({message: error?.message || error.toString()})
        }
    })

    const onDeleteConfirm = () => {
        mutate({id: option.id});
    }
    return (
        <Modal onClose={onClose}>
            <ModalTitle>
                Confirm Delete
            </ModalTitle>
            <ModalContent>
                <CenteredContent>
                    {
                        loadingEvents ? <CircularLoader small/> :
                            _.isEmpty(data?.events?.events) ? <div style={{textAlign: 'center'}}>
                                {message || 'Are you sure you want to delete this entity? This action cannot be undone'}
                            </div> : <div style={{textAlign: 'center'}}>
                                {cannotDeleteMessage || 'This option cannot be deleted. It is already used in documented entities.'}
                            </div>
                    }
                </CenteredContent>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button disabled={loadingEvents || !_.isEmpty(data?.events?.events)} onClick={onDeleteConfirm}
                            destructive>{loading ? 'Deleting...' : 'Delete'}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
