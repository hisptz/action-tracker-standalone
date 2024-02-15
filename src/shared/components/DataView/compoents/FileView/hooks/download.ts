import { useCallback } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import { last } from 'lodash'

const dEDownloadQuery = {
    report: {
        resource: 'events',
        id: 'files',
        params: ({
                     dataElement,
                     event
                 }: any) => {
            return {
                eventUid: event,
                dataElementUid: dataElement
            }
        }
    }
}

const attrDownloadQuery = {
    report: {
        resource: 'trackedEntityAttributes',
        id: 'files',
        params: ({
                     trackedEntityAttribute,
                     event
                 }: any) => {
            return {
                trackedEntityUid: event,
                trackedEntityAttributeUid: trackedEntityAttribute
            }
        }
    }
}

export function downloadFile (data: any, filename: string) {
    var blobData = [data]
    var blob = new Blob(blobData, { type: 'application/octet-stream' })

    var blobURL = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob)
    var tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', filename)

    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank')
    }

    document.body.appendChild(tempLink)
    tempLink.click()

    // Fixes "webkit blob resource error 1"
    setTimeout(function () {
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(blobURL)
    }, 200)
}
export function getFileExtension (file: Blob) {
    return last(file.type.split('/'))
}
export function useDownload (type: 'program' | 'programStage') {
    const {
        refetch,
        loading
    } = useDataQuery(type === 'program' ? attrDownloadQuery : dEDownloadQuery, {
        lazy: true
    })
    const download = useCallback(
        async ({
                   trackedEntityAttribute,
                   dataElement,
                   instance
               }: { instance: string, trackedEntityAttribute?: string; dataElement?: string }) => {
            const data = await refetch({
                event: instance,
                dataElement,
                trackedEntityAttribute
            })

            const file = data.report as unknown as Blob
            return downloadFile(data.report, `${file.name}.${getFileExtension(file)}`)

        },
        [],
    )

    return {
        download,
        downloading: loading
    }
}

