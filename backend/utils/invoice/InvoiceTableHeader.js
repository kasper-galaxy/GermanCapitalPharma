import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = 'gray'
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: 'lightgray',
        backgroundColor: 'lightgray',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        textAlign: 'center',
        fontWeight: 600,
        flexGrow: 1,
    },
    description: {
        width: '60%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    qty: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    rate: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    amount: {
        width: '15%'
    },
  });

  const InvoiceTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.description}>Beschreibung</Text>
        <Text style={styles.qty}>Menge</Text>
        <Text style={styles.rate}>Preis</Text>
        <Text style={styles.amount}>Betrag</Text>
    </View>
  );
  
  export default InvoiceTableHeader