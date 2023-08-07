import React, { useState } from 'react'
import {
    Button,
    ButtonStrip,
    CenteredContent,
    InputField,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    Tab,
    TabBar
} from '@dhis2/ui'
import { IconsContainer } from './components/IconsContainer'
import { isEmpty } from 'lodash'
import i18n from '@dhis2/d2-i18n'

const iconTabs = [
    {
        name: 'ALL',
        key: 'all'
    },
    {
        name: 'POSITIVE',
        key: 'positive',
    },
    {
        name: 'NEGATIVE',
        key: 'negative',
    },
    {
        name: 'OUTLINE',
        key: 'outline',
    },
]

export interface IconsSelectorDialogProps {
    hide: boolean;
    onClose: () => void;
    onUpdate: (value: string) => void;
    initialSelectedIcon: string;
}

export function IconsSelectorModal ({
                                        onClose,
                                        hide,
                                        onUpdate,
                                        initialSelectedIcon
                                    }: IconsSelectorDialogProps) {
    const [selectedTab, setSelectedTab] = useState<{ key: string; name: string }>(iconTabs[0])
    const [selectedIcon, setSelectedIcon] = useState(initialSelectedIcon)
    const [searchInput, setSearchInput] = useState('')

    function getSearchedValue (value: { value: string }) {
        setSearchInput(value?.value)
    }

    const getSelectedIcon = (icon: string) => {
        setSelectedIcon(icon)
    }

    const onUpdateClick = () => {
        onUpdate(selectedIcon)
        onClose()
    }

    function closeModal () {
        onClose()
    }

    const selectTab = (tab: { name: string; key: string }) => {
        setSelectedTab(tab)
    }

    return (
        <Modal position="middle" hide={hide} onClose={onClose} large>
            <ModalTitle>{i18n.t('Select Icon')}</ModalTitle>
            <ModalContent>
                <CenteredContent>
                    <div className="icon-selector-dialog-container">
                        <div

                        >
                            <div style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ width: '70%' }}>
                                    <TabBar fixed>
                                        {(iconTabs || []).map((tab) => {
                                            return (
                                                <Tab
                                                    key={tab.name}
                                                    onClick={() => selectTab(tab)}
                                                    selected={tab.name === selectedTab?.name}
                                                >
                                                    {tab.name}
                                                </Tab>
                                            )
                                        })}
                                    </TabBar>
                                </div>
                                <div style={{ width: '20%' }}>
                                    <InputField name="searchIconsField" value={searchInput}
                                                placeholder={i18n.t('Search icons')}
                                                onChange={getSearchedValue}/>
                                </div>
                            </div>
                            <div style={{
                                maxHeight: 500,
                                overflow: 'auto'
                            }} className="flex-1 ">
                                <IconsContainer
                                    selectedTab={selectedTab}
                                    setSelectedIcon={getSelectedIcon}
                                    searchInput={searchInput}
                                />
                            </div>
                        </div>
                    </div>
                </CenteredContent>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={closeModal}>Hide</Button>
                    <Button
                        primary
                        disabled={isEmpty(selectedIcon)}
                        onClick={onUpdateClick}
                    >
                        {i18n.t('Select')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

