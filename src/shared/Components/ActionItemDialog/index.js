import PropTypes from 'prop-types';
import {Modal, ModalTitle, ModalContent, ModalActions, Button, ButtonStrip, Box} from '@dhis2/ui';
import ActionItemForm from './Components/ActionItemForm'
export function ActionItemDialog({onClose, onUpdate}) {
    return (
        <Modal onClose={onClose}>
        <ModalTitle>
            Add Action Item
        </ModalTitle>
        <ModalContent>
           <ActionItemForm />
        </ModalContent>
        <ModalActions>
            <ButtonStrip>
                <Button secondary onClick={onClose}>
                    Hide
                </Button>
                <Button primary onClick={()=>{
                    if(onUpdate){
                    //   onUpdate(selectedOrgUnit);
                    } else{
                        onClose()
                    }
                }}>
                    Update
                </Button>
            </ButtonStrip>
        </ModalActions>
    </Modal>
    )
}
ActionItemDialog.propTypes = {
   onUpdate:  PropTypes.func,
   onClose: PropTypes.func
}

export default ActionItemDialog
