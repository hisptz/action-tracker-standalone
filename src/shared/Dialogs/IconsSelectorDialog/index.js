import { useState, useEffect, useRef } from 'react';
import {
  Button,
  ButtonStrip,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  TabBar,
  Tab,
  CircularLoader,
  CenteredContent,
} from '@dhis2/ui';
import { useDhis2Icons } from '../../../core/hooks/dhis2Icon';
import { Dhis2IconState } from '../../../core/states';
import { useRecoilValue, useRecoilState } from 'recoil';
import IconsContainer from './Components/IconsContainer'
import {isEmpty} from 'lodash'

const iconTabs = [
  {
    name: 'ALL',
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
];

function IconsSelectorDialog({ onClose, onUpdate }) {
  const [selectedTab, setSelectedTab] = useState(iconTabs[0]);
  const [selectedIcon, setSelectedIcon] = useState(null);

  const getSelectedIcon = (icon) => {
      setSelectedIcon(icon);
  }
  function closeModal() {
    onClose()
  }


  const selectTab = (tab) => {

     
   setSelectedTab(tab);

  }

  return (
    <Modal onClose={(_) => onClose} large>
      <ModalTitle>Select Icon</ModalTitle>
      <ModalContent>
        <CenteredContent>
          <div className="icon-selector-dialog-container">
            <div
              styCenteredContentle={{
                width: 700,
              }}
            >
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
                  );
                })}
              </TabBar>
             
                 <IconsContainer selectedTab={selectedTab} setSelectedIcon={getSelectedIcon}/>
        
            </div>
          </div>
        </CenteredContent>
      </ModalContent>
      <ModalActions>
        <ButtonStrip>
          <Button onClick={(_) => closeModal()}>Hide</Button>
          <Button primary disabled={isEmpty(selectedIcon)} onClick={()=> onUpdate(selectedIcon)}  >Select</Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}

export default IconsSelectorDialog;
