import { DropdownButton, FlyoutMenu, IconDownload24, MenuItem } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import React, { useState } from 'react'
import { useDownload } from './hooks/download'

export function Download () {
    const [downloadStateRef, setDownloadStateRef] = useState(false)

    const {
        download,
        downloading
    } = useDownload()

    const onDownloadClick = (type: 'xlsx' | 'csv' | 'json') => () => {
        setDownloadStateRef(false)
        download(type)
    }

    return (
        <DropdownButton
            open={downloadStateRef}
            onClick={() => setDownloadStateRef((prevState) => !prevState)}
            component={<div className="w-100">
                <FlyoutMenu>
                    {/* <MenuItem */}
                    {/*     label={i18n.t('Excel')} */}
                    {/*     onClick={onDownloadClick('xlsx')} */}
                    {/* /> */}
                    {/* <MenuItem */}
                    {/*     label={i18n.t('CSV')} */}
                    {/*     onClick={onDownloadClick('csv')} */}
                    {/* /> */}
                    <MenuItem
                        label={i18n.t('JSON')}
                        onClick={onDownloadClick('json')}
                    />
                </FlyoutMenu>
            </div>}
            loading={downloading}
            icon={<IconDownload24/>}>
            {downloading ? i18n.t('Downloading...') : i18n.t('Download')}
        </DropdownButton>
    )
}
