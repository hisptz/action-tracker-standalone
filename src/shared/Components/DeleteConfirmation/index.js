import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    ButtonStrip,
    CenteredContent
} from '@dhis2/ui';
import {useAlert, useDataMutation} from "@dhis2/app-runtime";


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
        mutate();
    }

    return (
        <Modal onClose={onClose}>
            <ModalTitle>
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