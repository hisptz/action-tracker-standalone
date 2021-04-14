import {
  Table,
  TableHead,
  TableRowHead,
  TableCellHead,
  TableBody,
  TableRow,
  TableCell,
} from '@dhis2/ui';
import FullPageLoader from '../FullPageLoader'

function PDFTable({ teiItems, isLoading }) {
  const styles = {
    listTable: {
      marginBottom: '1em',
    },
  };
  return (
    <div id="pdfTable">
      {teiItems && teiItems.length ? (
        teiItems.map((teiItem) => {
          return (
            <Table style={styles.listTable} key={teiItem?.id}>
              <TableHead>
                <TableRowHead>
                  <TableCellHead>Indicator</TableCellHead>
                  <TableCellHead>Gap</TableCellHead>
                  <TableCellHead>Possible Solution</TableCellHead>
                  <TableCellHead>Action Items</TableCellHead>
                  <TableCellHead>Responsible Person</TableCellHead>
                  <TableCellHead>Start Date</TableCellHead>
                  <TableCellHead>End Date</TableCellHead>
                  <TableCellHead>Status</TableCellHead>
                </TableRowHead>
              </TableHead>
              <TableBody>
                {teiItem.items &&
                  teiItem.items.length &&
                  teiItem.items.map((item, index) => {
                    return (
                      <TableRow key={item?.rowId}>
                        <TableCell rowspan={teiItem?.items?.length}>{index === 0 && item?.indicator}</TableCell>
                        <TableCell>{item?.gap}</TableCell>
                        <TableCell>{item?.possibleSolution}</TableCell>
                        <TableCell>{item?.actionItem}</TableCell>
                        <TableCell>{item?.responsiblePerson}</TableCell>
                        <TableCell>{item?.startDate}</TableCell>
                        <TableCell>{item?.endDate}</TableCell>
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
