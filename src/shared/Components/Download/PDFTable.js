import {
  Table,
  TableHead,
  TableRowHead,
  TableCellHead,
  TableBody,
  TableRow,
  TableCell,
} from '@dhis2/ui';
import FullPageLoader from '../FullPageLoader';
import { useRecoilValue } from 'recoil';
import { DimensionsState, PageState } from '../../../core/states';
import { TableStateSelector } from '../../../core/states/column';
import { map, concat, filter, values } from 'lodash';
import { Period } from '@iapps/period-utilities';

function PDFTable({ teiItems, isLoading }) {
  const styles = {
    listTable: {
      marginBottom: '1em',
    },
  };
  const tableColumnsData = useRecoilValue(TableStateSelector);

  const currentTab = useRecoilValue(PageState);
  return (
    <div id="pdfTable">
      {teiItems && teiItems.length ? (
        teiItems.map((teiItem) => {
          return (
            <Table style={styles.listTable} key={teiItem?.id}>
              <TableHead>
                <TableRowHead>
                  {map(teiItem.headers || [], (headerItem) => {
                    return (
                      <TableCellHead>{headerItem?.displayName}</TableCellHead>
                    );
                  })}
                  {currentTab === 'Planning' && (
                    <TableCellHead>Status</TableCellHead>
                  )}
                  {currentTab === 'Tracking' &&
                    (tableColumnsData?.actionStatusTable?.columns || []).map(
                      (actionStatusColumn, index) => {
                        return (
                          <TableCellHead key={actionStatusColumn}>
                            {actionStatusColumn?.name}
                          </TableCellHead>
                        );
                      }
                    )}
                </TableRowHead>
              </TableHead>
              <TableBody>
                {teiItem.items &&
                  teiItem.items.length &&
                  teiItem.items.map((item, index) => {
                    return (
                      <TableRow key={item?.rowId}>
                        {map(teiItem.headers || [], (columnItem) => {
                          return (
                            <TableCell key={columnItem?.name}>
                              {item[columnItem?.name]?.value}
                            </TableCell>
                          );
                        })}

                        {currentTab === 'Planning' && (
                          <TableCell>{item?.statuses[0]}</TableCell>
                        )}
                        {currentTab === 'Tracking' &&
                          (item.statuses || []).map((status, index) => {
                            return <TableCell key={index}>{status}</TableCell>;
                          })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          );
        })
      ) : (
        <FullPageLoader text={'Configuring Action tables. Please wait...'} />
      )}
    </div>
  );
}

export default PDFTable;
