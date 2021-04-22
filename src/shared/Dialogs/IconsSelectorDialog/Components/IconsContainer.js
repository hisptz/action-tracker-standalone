import { useState, useEffect } from 'react';
import { CircularLoader, CenteredContent } from '@dhis2/ui';
import { useRecoilValue, useRecoilState } from 'recoil';
import { Dhis2IconState } from '../../../../core/states';
import InfiniteScroll from 'react-infinite-scroller';
import { map, filter, isEmpty, findLastIndex } from 'lodash';
import DHIS2Icon from '../../../Components/DHIS2Icon';
import { useDhis2Icons } from '../../../../core/hooks/dhis2Icon';
import '../styles/iconSelectorDialog.css';

function IconsContainer({ selectedTab, setSelectedIcon, searchInput }) {
  const ICONS_PER_LOAD = 100;

  const { loading, dhis2Icons, error } = useDhis2Icons();
  // const dhis2Icons = useRecoilValue(Dhis2IconState);
  const [selectedIconData, setSelectedIconData] = useState();
  const [numberOfPages, setNumberOfPages] = useState();
  const [filteredIcons, setFilteredIcons] = useState([]);
  const [icons, setIcons] = useState([]);
  const [hasMoreIcons, setHasMoreiIcons] = useState(true);
  const [searchedIcons, setSearchedIcons] = useState([]);

  useEffect(() => {
    function getSearchedItems() {
      const filteredSearchedIcons = filter(filteredIcons || [], (icon) => {
        const searchText = searchInput.toLocaleLowerCase();
        const iconKey = icon?.key?.toLocaleLowerCase();
        if (iconKey?.includes(searchText)) {
          return icon;
        }
      });
      setSearchedIcons(filteredSearchedIcons);
    }
    getSearchedItems()
  }, [searchInput]);

  useEffect(() => {
    function filterIcons() {
      if (!loading) {
        if (selectedTab) {
          if (selectedTab.name === 'ALL') {
            setFilteredIcons(dhis2Icons);
          } else {
            const filteredIcons = filter(dhis2Icons || [], (icon) => {
              const categoryStr = /[^_]*$/.exec(icon?.key)[0] || '';
              if (categoryStr === selectedTab?.key) {
                return icon;
              }
            });
            setFilteredIcons(filteredIcons);
          }
        }
      }
    }
    filterIcons();
  }, [selectedTab, dhis2Icons]);

  // useEffect(() => {
  //   function fetch() {
  //     if(!loading){
  //       if (filteredIcons?.length) {
  //         console.log(filteredIcons.length / ICONS_PER_LOAD);
  //         setNumberOfPages(Math.ceil(filteredIcons.length / ICONS_PER_LOAD));

  //         if(numberOfPages && numberOfPages > 1){
  //           setHasMoreiIcons(true);
  //         }
  //       }
  //       setIcons([]);
  //       if (filteredIcons?.length) {
  //         setIcons(filteredIcons.slice(0, (ICONS_PER_LOAD - 1)));
  //       }
  //     }
  //   }
  //   fetch();
  // }, [filteredIcons, loading]);

  function getSelectedIcon(icon) {
    setSelectedIconData(icon);
    setSelectedIcon(icon);
  }

  // const fetchMoreData = (page) => {
  //   if (page === numberOfPages - 1) {
  //     setHasMoreiIcons(false);
  //   }
  //   // setTimeout(() => {
  //   const lastIndexOfItems = findLastIndex(icons || []);
  //   // if (lastIndexOfItems > 0) {
  //   const newIcons = [
  //     ...icons,
  //     ...filteredIcons.slice(
  //       page * ICONS_PER_LOAD,
  //       lastIndexOfItems + ICONS_PER_LOAD
  //     ),
  //   ];
  //   setIcons(newIcons);
  //   // }, 1500);
  // };
  const loader = <CircularLoader large />;


  return (
    <div
      style={{
        marginTop: '1em',
        height: '500px',
        width: '100%',
      }}
    >
      {loading && <CenteredContent>{loader}</CenteredContent>}
      {!loading && !filteredIcons.length  && <CenteredContent>
        <i>There is no icon to display for now.</i>
      </CenteredContent>}
      {!loading && !searchedIcons.length &&  !isEmpty(searchInput)   && <CenteredContent>
        <i>There is no icon to display for the searched text</i>
      </CenteredContent>}
      {!loading && isEmpty(searchInput) && filteredIcons.length && (
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
          {map(filteredIcons || [], (icon) => {
            return (
              <div
                className={
                  selectedIconData?.key === icon?.key ? 'selected-icon' : ''
                }
                key={`${icon?.key}-container`}
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
      )}
      {!loading && !isEmpty(searchInput) && filteredIcons.length && (
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
          {map(searchedIcons || [], (icon) => {
            return (
              <div
                className={
                  selectedIconData?.key === icon?.key ? 'selected-icon' : ''
                }
                key={`${icon?.key}-container`}
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
      )}
    </div>
  );
}

export default IconsContainer;
