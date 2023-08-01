import React, { useEffect, useRef } from 'react'
import { selectorFamily, useRecoilValueLoadable } from 'recoil'
import { replace } from 'lodash'
import { DataEngineState } from '../../state/engine'
import { queue } from 'async'

export function formatSvg (svg = '', {
    size,
    color
}: { size: number; color: string }) {
    return replace(replace(svg, 'width="48"', `width="${size}"`), 'height="48"', `height="${size}"`).replaceAll('fill="#333333"', `fill="${color}"`)
}

const iconQuery = {
    icon: {
        resource: 'icons',
        id: ({ id }: any) => id
    }
}

async function getIcon ({
                            engine,
                            iconName
                        }: { engine: any; iconName: string }) {
    return await engine.query(iconQuery, { variables: { id: `${iconName}/icon.svg` } })
}

const q = queue(getIcon, 5)

const Dhis2IconState = selectorFamily({
    key: 'icon-state',
    get: (iconName: string) => async ({ get }) => {
        const engine = get(DataEngineState)
        if (engine) {
            const data: any = await q.push({
                engine,
                iconName
            })
            if (data) {
                if (data.icon) {
                    if (data.icon instanceof Blob) {
                        return (await data.icon.text())
                    } else {
                        return (data.icon)
                    }
                }
            }
        }
    }
})

export interface DHIS2IconProps {
    iconName: string
    size: number
    color: string
    style?: any
}

export function DHIS2Icon ({
                               iconName,
                               size,
                               color,
                               style
                           }: DHIS2IconProps) {
    const {
        contents: icon,
        state
    } = useRecoilValueLoadable(Dhis2IconState(iconName))
    const iconRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (icon) {
            if (iconRef.current) {
                iconRef.current.innerHTML = formatSvg(icon, {
                    size,
                    color
                })
            }
        }
    }, [icon])
    return (
        state === 'loading' ? <div/> : <div id={`dhis2-icon-${iconName}`} style={style} ref={iconRef}/>
    )
}
