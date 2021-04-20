import {useState} from 'react';
import {
  Button,
  ButtonStrip,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  TabBar,
  Tab,
} from '@dhis2/ui';
import DHIS2Icon from '../../Components/DHIS2Icon';
import { useDhis2Icons } from '../../../core/hooks/dhis2Icon';
import { Dhis2IconState } from '../../../core/states';
import { useRecoilValue } from 'recoil';
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
function IconsSelectorDialog({ onClose }) {
  const [selectedTab, setSelectedTab] = useState('ALL');
  const iconsRequest = useDhis2Icons();
  const dhis2Icons = useRecoilValue(Dhis2IconState);
  return (
    <Modal className="dialog-container" onClose={(_) => onClose} large>
      <ModalTitle>Select Icon</ModalTitle>
      <ModalContent>
        <div
          style={{
            maxWidth: 700,
          }}
        >
          <TabBar>
            {(iconTabs || []).map((tab) => {
              return (
                <Tab key={tab.name} onClick={() => setSelectedTab(tab?.name)} selected={tab.name === selectedTab}>
                  {tab.name} 
                </Tab>
              );
            })}
          </TabBar>
        </div>
      </ModalContent>
      <ModalActions>
        <ButtonStrip>
          <Button onClick={(_) => onClose}>Hide</Button>
          <Button primary>Select</Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}

export default IconsSelectorDialog;
