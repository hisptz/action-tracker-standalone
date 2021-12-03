import {FlyoutMenu, Layer, MenuDivider, MenuItem, Popper} from "@dhis2/ui";
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import React from "react";


export default function DownloadOptionsMenu({reference, onDownloadPDF, onClose}) {

    return (
        (
            <Layer onClick={onClose}>
                <Popper reference={reference} placement='bottom-start'>
                    <FlyoutMenu>
                        <MenuItem onClick={_ => {
                            onDownloadPDF()
                            onClose();
                        }} icon={<PictureAsPdfIcon/>} label='PDF'/>
                    </FlyoutMenu>
                </Popper>
            </Layer>
        )
    )
}
