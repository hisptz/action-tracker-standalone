import {Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle} from "@dhis2/ui";
import DHIS2Icon from '../../Components/DHIS2Icon';
import { useDhis2Icons } from '../../../core/hooks/dhis2Icon';
import { Dhis2IconState } from '../../../core/states';
import { useRecoilValue } from 'recoil';

function IconsSelectorDialog({onClose}) {
    const iconsRequest = useDhis2Icons();
    const dhis2Icons = useRecoilValue(Dhis2IconState);
    return (
        <Modal className="dialog-container" onClose={_ => onClose} large>
        <ModalTitle>Select Icon</ModalTitle>
        <ModalContent>
          
        </ModalContent>
        <ModalActions>
            <ButtonStrip>
                <Button
                    onClick={_ => onClose}
                >
                    Hide
                </Button>
                <Button
                  
                    primary
                >
                    Select
                </Button>

            </ButtonStrip>
        </ModalActions>
    </Modal>
    )
}

export default IconsSelectorDialog
