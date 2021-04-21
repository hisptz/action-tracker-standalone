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
import { map } from 'lodash';
import { Period } from '@iapps/period-utilities';
function getQuarterColumnNames(period) {
  const periodInstance = new Period();
  const { quarterly } = periodInstance.getById(period[0]?.id) || {};

  return map(quarterly || [], (quarter) => {
    return quarter && quarter.name ? quarter.name : '';
  });
}
function PDFTable({ teiItems, isLoading }) {
  const styles = {
    listTable: {
      marginBottom: '1em',
    },
  };
  const { orgUnit, period } = useRecoilValue(DimensionsState) || {};
  const currentTab = useRecoilValue(PageState);
  const quarterNames = getQuarterColumnNames(period);
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
                    (quarterNames || []).map((quarter, index) => {
                      return (
                        <TableCellHead key={index}>{quarter}</TableCellHead>
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
