import { useState, useEffect } from 'react';
import { CircularLoader } from '@dhis2/ui';
import { useRecoilValue, useRecoilState } from 'recoil';
import { Dhis2IconState } from '../../../../core/states';
import InfiniteScroll from 'react-infinite-scroller';
import { map, filter, isEmpty, findLastIndex } from 'lodash';
import DHIS2Icon from '../../../Components/DHIS2Icon';
import { useDhis2Icons } from '../../../../core/hooks/dhis2Icon';
import '../styles/iconSelectorDialog.css';

function IconsContainer({ selectedTab, setSelectedIcon }) {
  const iconsResponse = useDhis2Icons({ selectedCategory: selectedTab });
  const dhis2Icons = useRecoilValue(Dhis2IconState);
  const [selectedIconData, setSelectedIconData] = useState();

  function getSelectedIcon(icon) {
    setSelectedIconData(icon);
    setSelectedIcon(icon);
  }

  const [icons, setIcons] = useState([]);

  const [hasMoreIcons, setHasMoreiIcons] = useState(true);

  useEffect(() => {
    function fetch() {
      setIcons([]);
      if (dhis2Icons && dhis2Icons.length && icons.length === 0) {
        setIcons(dhis2Icons.slice(0, 100));
      }
    }
    fetch();
  }, [dhis2Icons]);
  const fetchMoreData = () => {
    if (icons.length >= 500) {
      setHasMoreiIcons(false);
    }
    setTimeout(() => {
      const lastIndexOfItems = findLastIndex(icons || []);
      if (lastIndexOfItems > 0) {
        const newIcons = [
          ...icons,
          ...dhis2Icons.slice(lastIndexOfItems + 1, lastIndexOfItems + 100),
        ];
        setIcons(newIcons);
      }
    }, 1500);
  };
  const loader = <CircularLoader large />;

  return (
    <div
      style={{
        marginTop: '1em',
        height: '800px',
        width: '100%',
      }}
    >
      {iconsResponse && iconsResponse.loading === false && icons.length && (
        <InfiniteScroll
          pageStart={0}
          loadMore={fetchMoreData}
          hasMore={hasMoreIcons}
          loader={loader}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              height: '100%',
              width: '100%',
            }}
            id="scrollableDiv"
          >
            {map(icons || [], (icon, index) => {
              return (
                <div
                  className={
                    selectedIconData?.key === icon?.key ? 'selected-icon' : ''
                  }
                  key={index}
                  style={{ marginRight: '1em', marginBottom: '0.5em' }}
                  onClick={() => {
                    getSelectedIcon(icon);
                  }}
                >
                  <DHIS2Icon key={icon?.key} iconName={icon?.key} size={50} />
                </div>
              );
            })}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}

export default IconsContainer;
