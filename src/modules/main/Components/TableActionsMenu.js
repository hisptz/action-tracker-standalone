import {FlyoutMenu, Layer, MenuDivider, MenuItem, Popper} from "@dhis2/ui";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";


export default function TableActionsMenu({object, reference, onDelete, onEdit, onClose}) {

    return (
        (
            <Layer onClick={onClose}>
                <Popper reference={reference} placement='bottom-start'>
                    <FlyoutMenu>
                        <MenuItem onClick={_ => {
                            onEdit(object);
                            onClose();
                        }} icon={<EditIcon/>} label='Edit'/>
                        <MenuDivider/>
                        <MenuItem onClick={_ => {
                            onDelete(object);
                            onClose();
                        }} icon={<DeleteIcon/>} destructive label='Delete'/>
                    </FlyoutMenu>
                </Popper>
            </Layer>
        )
    )
}
