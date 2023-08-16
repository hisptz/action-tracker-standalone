import React from 'react'
import { Button, IconDelete24, IconEdit24, IconMore24, IconView24, Menu, MenuItem, Popover } from '@dhis2/ui'
import { compact } from 'lodash'
import i18n from '@dhis2/d2-i18n'

export interface ActionButtonProps {
    onEdit?: () => void;
    onDelete?: () => void;
    onView?: () => void;
}

export function ActionButton ({
                                  onEdit,
                                  onDelete,
                                  onView
                              }: ActionButtonProps) {
    const [ref, setRef] = React.useState<HTMLButtonElement | null>(null)

    const menu = compact([
        (onView ? {
            label: i18n.t('View'),
            onClick: onView,
            icon: <IconView24/>
        } : undefined),
        (onEdit ? {
            label: i18n.t('Edit'),
            onClick: onEdit,
            icon: <IconEdit24/>
        } : undefined),
        (onDelete ? {
            label: i18n.t('Delete'),
            onClick: onDelete,
            icon: <IconDelete24/>
        } : undefined)
    ])

    return (
        <>
            {
                ref && (<Popover onClickOutside={() => setRef(null)} reference={ref}>
                    <Menu>
                        {
                            menu.map(({
                                          label,
                                          onClick,
                                          icon
                                      }) => (
                                <MenuItem
                                    label={label}
                                    icon={icon} key={`${label}-menu-item`} onClick={() => {
                                    setRef(null)
                                    onClick()
                                }}/>
                            ))
                        }
                    </Menu>
                </Popover>)
            }
            <Button small onClick={(_: any, event: React.MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation()
                setRef(event.currentTarget)
            }} icon={<IconMore24/>}/>
        </>
    )
}
