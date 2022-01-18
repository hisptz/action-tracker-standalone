import {useRef} from "react";
import {useReactToPrint} from "react-to-print";
import {utils as xlsx, writeFile} from "xlsx";
import {useRecoilCallback, useRecoilValue} from "recoil";
import {DownloadActive, DownloadType} from "../Components/Download/state/download";
import i18n from '@dhis2/d2-i18n'


export default function useDownload() {
    const type = useRecoilValue(DownloadType);
    const title = i18n.t("Action Tracker Data");
    const downloadRef = useRef(null)
    const handlePrint = useReactToPrint({
        content: () => downloadRef.current,
        onAfterPrint: () => {
            resetDownload()
        },
        documentTitle: title,
    })

    const resetDownload = useRecoilCallback(({reset}) => () => {
        reset(DownloadActive)
        reset(DownloadType)
    }, [])

    const onDownload = () => {
        if (type === 'pdf') {
            handlePrint();
        } else {
            const sheet = xlsx.table_to_sheet(downloadRef.current);
            const workbook = xlsx.book_new();
            xlsx.book_append_sheet(workbook, sheet, `${title.substring(0, 31)}`);
            writeFile(workbook, `${title}.${"xlsx"}`);
            resetDownload();
        }
    }

    return {
        downloadRef,
        onDownload
    }
}
