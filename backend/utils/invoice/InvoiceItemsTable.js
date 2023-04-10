import React from 'react';
import {View, StyleSheet } from '@react-pdf/renderer';
import InvoiceTableHeader from './InvoiceTableHeader.js';
import InvoiceTableRow from './InvoiceTableRow.js';

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderWidth: 1,
        borderColor: 'gray',
    },
});

  const InvoiceItemsTable = ({items}) => {
    console.log('Table ', items);
    return <View style={styles.tableContainer}>
        <InvoiceTableHeader />
        <InvoiceTableRow items={items} />
        {/* <InvoiceTableBlankSpace rowsCount={ tableRowsCount - invoice.items.length} /> */}
        {/* <InvoiceTableFooter items={invoice.items} /> */}
    </View>;
  };
  
  export default InvoiceItemsTable