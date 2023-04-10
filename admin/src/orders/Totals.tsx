import * as React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import { useRecordContext, useTranslate } from 'react-admin';

import { Order } from '../types';
import { TableCellRight } from './TableCellRight';

const calcTaxPerVAT = (obj: any) => {
    var holder: any = {};

    obj.forEach(function(d: any) {
    if (holder.hasOwnProperty(d.vat)) {
        holder[d.vat] = holder[d.vat] + d.price * d.qty * d.vat;
    } else {
        holder[d.vat] = d.price * d.qty * d.vat;
    }
    });

    var obj2 = [];

    for (var prop in holder) {
        obj2.push({ vat: parseFloat(prop), sum: holder[prop] });
    }
    obj2.sort((obj: any, nxt: any) => obj.vat - nxt.vat);
    return obj2;
}

const Totals = () => {
    const record = useRecordContext<Order>();
    console.log(record);
    const translate = useTranslate();
    const vats = calcTaxPerVAT(record ? record.orderItems : []);

    return (
        <Table sx={{ minWidth: '35em' }}>
            <TableBody>
                <TableRow>
                    <TableCell>
                        {translate('resources.orders.fields.basket.sum')}
                    </TableCell>
                    <TableCellRight>
                        {(record?.netPrice).toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'EUR',
                        })}
                    </TableCellRight>
                </TableRow>
                {/* <TableRow>
                    <TableCell>
                        {translate('resources.orders.fields.basket.delivery')}
                    </TableCell>
                    <TableCellRight>
                        {record?.delivery_fees.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'EUR',
                        })}
                    </TableCellRight>
                </TableRow>
                <TableRow>
                    <TableCell>
                        {translate('resources.orders.fields.basket.taxes')} (
                        {record?.tax_rate.toLocaleString(undefined, {
                            style: 'percent',
                        })}
                        )
                    </TableCell>
                    <TableCellRight>
                        {record?.taxes.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'USD',
                        })}
                    </TableCellRight>
                </TableRow> */}
                {vats.map(item => (
                    <TableRow key={item.vat}>
                        <TableCell>
                            {translate('resources.orders.fields.basket.taxes', {
                                vat: item.vat.toLocaleString(undefined, {
                                    style: 'percent',
                                })
                            })}
                        </TableCell>
                        <TableCellRight>
                            {item.sum.toLocaleString(undefined, {
                                style: 'currency',
                                currency: 'EUR',
                            })}
                        </TableCellRight>
                    </TableRow>
                ))}
                <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                        {translate('resources.orders.fields.basket.total')}
                    </TableCell>
                    <TableCellRight sx={{ fontWeight: 'bold' }}>
                        {record?.totalPrice.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'EUR',
                        })}
                    </TableCellRight>
                </TableRow>
            </TableBody>
        </Table>
    );
};

export default Totals;
