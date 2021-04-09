import {FlyoutMenu, Layer, MenuDivider, MenuItem, Popper} from "@dhis2/ui";
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import DescriptionIcon from '@material-ui/icons/Description';
import React from "react";


export default function DownloadOptionsMenu({reference, onDownloadExcel, onDownloadPDF, onClose}) {

    return (
        (
            <Layer onClick={onClose}>
                <Popper reference={reference} placement='bottom-start'>
                    <FlyoutMenu>
                        <MenuItem onClick={_ => {
                           onDownloadPDF()
                            onClose();
                        }} icon={<PictureAsPdfIcon/>} label='PDF'/>
                        <MenuDivider/>
                        <MenuItem onClick={_ => {
                           onDownloadExcel();
                            onClose();
                        }} icon={<DescriptionIcon/>}  label='Excel'/>
                    </FlyoutMenu>
                </Popper>
            </Layer>
        )
    )
}
