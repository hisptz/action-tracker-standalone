import React from 'react'
import { find, isEmpty, last, sortBy } from 'lodash'
import i18n from '@dhis2/d2-i18n'
import { useConfiguration } from '../../../../../../../../../../../../shared/hooks/config'
import { useMetadata } from '../../../../../../../../../../../../shared/hooks/metadata'
import classes from '../../../DataTable/DataTable.module.css'
import { DHIS2Icon } from '../../../../../../../../../../../../shared/components/DHIS2Icon/DHIS2Icon'

export interface LatestStatusProps {
    events: any[];
}

export function hexToRgba (hex: string, alpha: number): string | null {
    // Check if the input is a valid hexadecimal color
    const validHexPattern = /^#([A-Fa-f0-9]{3}){1,2}$/
    if (!validHexPattern.test(hex)) {
        return null
    }

    // Normalize the input (remove '#') and expand the short hex format (#RGB to #RRGGBB)
    const normalizedHex = hex.replace('#', '')
    const fullHex = normalizedHex.length === 3 ? normalizedHex.replace(/(.)/g, '$1$1') : normalizedHex

    // Parse the RGB values
    const red = parseInt(fullHex.substring(0, 2), 16)
    const green = parseInt(fullHex.substring(2, 4), 16)
    const blue = parseInt(fullHex.substring(4, 6), 16)

    // Validate the alpha value (should be between 0 and 1)
    alpha = Math.max(0, Math.min(1, alpha))

    // Return the RGBA string
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

function getTextColorForBackground (backgroundColor: string): string {
    // Convert the background color to RGB values
    const hexToRgb = (hex: string): number[] => {
        const bigint = parseInt(hex.replace('#', ''), 16)
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
    }

    // Calculate the relative luminance of a color
    const getRelativeLuminance = (r: number, g: number, b: number): number => {
        const sRGB = (c: number): number => {
            const val = c / 255
            return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
        }

        return 0.2126 * sRGB(r) + 0.7152 * sRGB(g) + 0.0722 * sRGB(b)
    }

    // Determine if the color is light or dark based on relative luminance
    const isColorDark = (luminance: number): boolean => luminance > 0.179

    const [r, g, b] = hexToRgb(backgroundColor)

    const luminance = getRelativeLuminance(r, g, b)
    const textColor = isColorDark(luminance) ? '#ffffff' : '#000000'

    return textColor
}

export function LatestStatus ({ events }: LatestStatusProps) {
    const { config } = useConfiguration()
    const actionStatusConfig = config?.action.statusConfig

    const { status: statusOptionSet } = useMetadata()

    const options = statusOptionSet?.options || []

    if (isEmpty(events)) {
        return (
            <div className="w-100 h-100">
                {i18n.t('N/A')}
            </div>
        )
    }

    const latestStatusEvent = last(sortBy(events, (event) => new Date(event.occurredAt)))

    if (!latestStatusEvent) {
        return (
            <div className="w-100 h-100">
                {i18n.t('N/A')}
            </div>
        )
    }

    const status = find(latestStatusEvent.dataValues, ['dataElement', actionStatusConfig?.stateConfig?.dataElement])?.value
    const selectedOption = find(options, ['code', status])

    const color = selectedOption?.style.color ?? '#FFFFFF'

    const textColor = '#000'

    return (
        <td style={{ background: hexToRgba(color, .5) ?? color }} className={classes['tracking-value-cell']}>
            <div className="w-100 h-100 row align-center center gap-8">
                <DHIS2Icon iconName={selectedOption?.style.icon as string} size={24} color={textColor}/>
                <b style={{ color: textColor }}>{selectedOption?.name}</b>
            </div>
        </td>
    )
}
