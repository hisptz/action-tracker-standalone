import { map } from 'lodash';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
  },
  container: {
    padding: '1.5em',
    marginTop: '20px',
  },
  table: {
    border: '1px solid black',
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  cell: {
    border: '1px solid black',
    padding: '1px',
    width: '100px',
  },
  text: {
    fontSize: '10px',
  },
  textHeader: {
    fontSize: '10px',
    fontWeight: '600',
  },
  title: {
    fontSize: '12px',
  },
});

function PDFTable({ teiItems, currentTab }) {
  return (
    <Document>
      <Page
        size="A4"
        orientation={currentTab === 'Tracking' ? 'landscape' : 'portrait'}
      >
        {teiItems?.length &&
          map(teiItems || [], (teiItem) => {
            return (
              <View key={teiItem?.id} style={styles.container}>
                <Text style={styles.title}>
                  {teiItem?.items[0]?.intervention +
                    ' - ' +
                    teiItem?.items[0]?.indicator}
                </Text>
                <View style={styles.table}>
                  <View style={styles.row}>
                    {map(teiItem?.headers || [], (header) => {
                      return (
                        <View key={header?.name} style={styles.cell}>
                          <Text style={styles.textHeader}>
                            {header?.displayName}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                  <View style={styles.column}>
                    {map(teiItem?.items || [], (item, itemIndex) => {
                      return (
                        <View key={item?.rowId} style={styles.row}>
                          {map(
                            teiItem?.headers || [],
                            (header, headerIndex) => {
                              return (
                                <View key={header?.name} style={styles.cell}>
                                  <Text style={styles.text}>
                                    {item[header?.name]}
                                  </Text>
                                </View>
                              );
                            }
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            );
          })}
      </Page>
    </Document>
  );
}

export default PDFTable;
