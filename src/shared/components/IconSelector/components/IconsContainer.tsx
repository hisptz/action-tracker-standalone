import React, { useEffect, useState } from 'react'
import { CenteredContent, CircularLoader } from '@dhis2/ui'
import { filter, head, isEmpty, map } from 'lodash'
import { DHIS2Icon } from '../../DHIS2Icon/DHIS2Icon'
import { useDhis2Icons } from '../../../hooks/icons'

export interface IconsContainerProps {
    selectedTab: { name: string; key: string },
    setSelectedIcon: (value: string) => void,
    searchInput: string
}

function IconView ({
                       icon,
                       selected,
                       onClick
                   }: { icon: { key: string }, selected: boolean, onClick: (icon: { key: string }) => void }) {

    return (
        <div
            className="row center align-center"
            key={`${icon?.key}-container`}
            style={{
                width: 48,
                height: 48,
                ...(selected ? { border: `2px solid var(--primary)` } : {})
            }}
            onClick={() => {
                onClick(icon)
            }}
        >
            <DHIS2Icon color="#000" key={icon?.key} iconName={icon?.key} size={48}/>
        </div>
    )
}

export function IconsContainer ({
                                    selectedTab,
                                    setSelectedIcon,
                                    searchInput
                                }: IconsContainerProps) {
    const {
        loading,
        dhis2Icons,
        error
    } = useDhis2Icons()
    const [selectedIconData, setSelectedIconData] = useState<{ key: string }>()
    const [filteredIcons, setFilteredIcons] = useState<Array<{ key: string }>>([])
    const [searchedIcons, setSearchedIcons] = useState<Array<{ key: string }>>([])

    useEffect(() => {
        function getSearchedItems () {
            const filteredSearchedIcons = filter(filteredIcons || [], (icon) => {
                const searchText = searchInput.toLocaleLowerCase()
                const iconKey = icon?.key?.toLocaleLowerCase()
                if (iconKey?.includes(searchText)) {
                    return icon
                }
            }) as Array<{ key: string }>
            setSearchedIcons(filteredSearchedIcons)
        }

        getSearchedItems()
    }, [searchInput])

    useEffect(() => {
        function filterIcons () {
            if (!loading) {
                if (selectedTab) {
                    if (selectedTab.name === 'ALL') {
                        setFilteredIcons(dhis2Icons)
                    } else {
                        const filteredIcons = filter(dhis2Icons || [], (icon) => {
                            const categoryStr = head(/[^_]*$/.exec(icon.key)) || ''
                            if (categoryStr === selectedTab?.key) {
                                return icon
                            }
                        }) as Array<{ key: string }>
                        setFilteredIcons(filteredIcons)
                    }
                }
            }
        }

        filterIcons()
    }, [selectedTab, dhis2Icons])

    function getSelectedIcon (icon: { key: string }) {
        setSelectedIconData(icon)
        setSelectedIcon(icon.key)
    }

    const loader = <CircularLoader large/>

    return (
        <div
            style={{
                marginTop: '1em',
                height: '500px',
                width: '100%',
            }}
        >
            {loading && <CenteredContent>{loader}</CenteredContent>}
            {!loading && !filteredIcons.length && <CenteredContent>
                <i>There is no icon to display for now.</i>
            </CenteredContent>}
            {!loading && !searchedIcons.length && !isEmpty(searchInput) && <CenteredContent>
                <i>There is no icon to display for the searched text</i>
            </CenteredContent>}
            {!loading && isEmpty(searchInput) && filteredIcons.length && (
                <div
                    className="row gap-16 center"
                    style={{
                        flexWrap: 'wrap',
                    }}
                >
                    {map(filteredIcons || [], (icon) => {
                        return (
                            <IconView key={`${icon.key}-icon-selector`} icon={icon}
                                      selected={selectedIconData?.key === icon?.key} onClick={getSelectedIcon}/>
                        )
                    })}
                </div>
            )}
            {!loading && !isEmpty(searchInput) && filteredIcons.length && (
                <div
                    className="row gap-16 w-100 h-100"
                    style={{
                        flexWrap: 'wrap'
                    }}
                >
                    {map(searchedIcons || [], (icon) => {
                        return (
                            <IconView key={`${icon.key}-icon-selector`} icon={icon}
                                      selected={selectedIconData?.key === icon?.key} onClick={getSelectedIcon}/>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
