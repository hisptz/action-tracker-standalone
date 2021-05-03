import { useState, useEffect } from 'react';
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
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { getPdfDownloadData } from '../../../core/services/downloadFilesService';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
  },
  table: {
   
    border: '1px solid black',
    marginTop: '1em',
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  cell: {
    border: '1px solid black',
    padding: '1px'
  },
  text: {
    fontSize: '10px'
  },
  bold: {
    fontSize: '10px',
    fontWeight: 'bold'
  }
});

function PDFTable({ teiItems, isLoading }) {
  console.log({ teiItems });
  const item = 'Kubali'
  // const styles = {
  //   listTable: {
  //     marginBottom: '1em',
  //   },
  // };
  // const tableColumnsData = useRecoilValue(TableStateSelector);

  // const currentTab = useRecoilValue(PageState);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {teiItems?.length &&
          map(teiItems || [], (teiItem) => {
            return (
              <View key={teiItem?.id} style={styles.table}>
                <View style={styles.row}>
                  {map(teiItem?.headers || [], (header) => {
                    return (
                      <View key={header?.name} style={styles.cell}>
                        <Text style={styles.bold}>{header?.displayName}</Text>
                      </View>
                    );
                  })}
                </View>
                <View style={styles.row}>
                {map(teiItem?.headers || [], (header) => {
                    return (
                      <View key={header?.name} style={styles.cell}>
                        <Text style={styles.text}>{header?.displayName}</Text>
                      </View>
                    );
                  })}

                </View>
              </View>
            );
          })}
      </Page>
    </Document>
  );
}

export default PDFTable;
