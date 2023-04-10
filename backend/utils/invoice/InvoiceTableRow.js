import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';
import { currencyFormatter } from '../libs.js';

const borderColor = 'gray'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontWeight: 600,
    },
    description: {
        width: '60%',
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    qty: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    rate: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    amount: {
        width: '15%',
        textAlign: 'right',
        paddingRight: 8,
    },
  });


const InvoiceTableRow = ({items}) => {
    console.log('Row ', items);
    
    return (<div>
        {items.map(item => (
            <View style={styles.row} key={item.name}>
                <Text style={styles.description}>{item.name}</Text>
                <Text style={styles.qty}>{item.qty}</Text>
                <Text style={styles.rate}>{currencyFormatter.format(item.price)}</Text>
                <Text style={styles.amount}>{currencyFormatter.format(item.qty * item.price)}</Text>
            </View>
        ))}
        </div> )
};
  
  export default InvoiceTableRow