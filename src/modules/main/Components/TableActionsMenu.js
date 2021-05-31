import {FlyoutMenu, Layer, MenuDivider, MenuItem, Popper} from "@dhis2/ui";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import i18n from '@dhis2/d2-i18n'

export default function TableActionsMenu({object, reference, onDelete, onEdit, onClose, roles}) {
    const {update: updateRole, delete: deleteRole} = roles || {update: false, delete: false};
    return (
        (
            <Layer onClick={onClose}>
                <Popper reference={reference} placement='bottom-start'>
                    <FlyoutMenu>
                        {
                            updateRole && <MenuItem onClick={_ => {
                                onEdit(object);
                                onClose();
                            }} icon={<EditIcon/>} label={i18n.t('Edit')}/>
                        }
                        {
                            (updateRole && deleteRole) &&  <MenuDivider/>
                        }
                        {
                            deleteRole && <MenuItem onClick={_ => {
                                onDelete(object);
                                onClose();
                            }} icon={<DeleteIcon/>} destructive label={i18n.t('Delete')}/>
                        }
                    </FlyoutMenu>
                </Popper>
            </Layer>
        )
    )
}
