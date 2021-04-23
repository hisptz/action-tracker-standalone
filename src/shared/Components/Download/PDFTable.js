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
import { map } from 'lodash';
import { Period } from '@iapps/period-utilities';

function PDFTable({ teiItems, isLoading }) {
  const styles = {
    listTable: {
      marginBottom: '1em',
    },
  };
  const tableColumnsData = useRecoilValue(TableStateSelector)

  const currentTab = useRecoilValue(PageState);
  return (
    <div id="pdfTable">
      {teiItems && teiItems.length ? (
        teiItems.map((teiItem) => {
          return (
            <Table style={styles.listTable} key={teiItem?.id}>
              <TableHead>
                <TableRowHead>
                  <TableCellHead>Indicator</TableCellHead>
                  <TableCellHead>Bottleneck</TableCellHead>
                  <TableCellHead>Possible Solution</TableCellHead>
                  <TableCellHead>Action Items</TableCellHead>
                  <TableCellHead>Responsible Person</TableCellHead>
                  <TableCellHead>Start Date</TableCellHead>
                  <TableCellHead>End Date</TableCellHead>
                  {currentTab === 'Planning' && (
                    <TableCellHead>Status</TableCellHead>
                  )}
                  {currentTab === 'Tracking' &&
                    (tableColumnsData?.actionStatusTable?.columns || []).map((actionStatusColumn, index) => {
                      return (
                        <TableCellHead key={actionStatusColumn}>{actionStatusColumn?.name}</TableCellHead>
                      );
                    })}
                </TableRowHead>
              </TableHead>
              <TableBody>
                {teiItem.items &&
                  teiItem.items.length &&
                  teiItem.items.map((item, index) => {
                    return (
                      <TableRow key={item?.rowId}>
                        <TableCell rowspan={teiItem?.items?.length}>
                          {index === 0 && item?.indicator}
                        </TableCell>
                        <TableCell>{item?.gap}</TableCell>
                        <TableCell>{item?.possibleSolution}</TableCell>
                        <TableCell>{item?.actionItem}</TableCell>
                        <TableCell>{item?.responsiblePerson}</TableCell>
                        <TableCell>{item?.startDate}</TableCell>
                        <TableCell>{item?.endDate}</TableCell>
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
