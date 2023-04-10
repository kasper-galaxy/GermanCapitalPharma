import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link, useTranslate, useGetMany, useRecordContext } from "react-admin";

import { Order, Product } from "../types";
import { TableCellRight } from "./TableCellRight";

const Basket = () => {
  const record = useRecordContext<Order>();
  const translate = useTranslate();

  const productIds = record
    ? record.orderItems.map((item: any) => item.product)
    : [];

  const { isLoading, data: products } = useGetMany<Product>(
    "products",
    { ids: productIds },
    { enabled: !!record }
  );
  const productsById = products
    ? products.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {} as any)
    : {};

  if (isLoading || !record || !products) return null;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            {translate("resources.orders.fields.basket.reference")}
          </TableCell>
          <TableCellRight>
            {translate("resources.orders.fields.basket.unit_price")}
          </TableCellRight>
          <TableCellRight>
            {translate("resources.orders.fields.basket.quantity")}
          </TableCellRight>
          <TableCellRight>
            {translate("resources.orders.fields.basket.total")}
          </TableCellRight>
        </TableRow>
      </TableHead>
      <TableBody>
        {record.orderItems.map((item: any) => (
          <TableRow key={item.product}>
            <TableCell>
              <Link to={`/products/${item.product}/show`}>
                {productsById[item.product].name}
              </Link>
            </TableCell>
            <TableCellRight>
              {productsById[item.product].price.toLocaleString(undefined, {
                style: "currency",
                currency: "EUR",
              })}
            </TableCellRight>
            <TableCellRight>{item.qty}</TableCellRight>
            <TableCellRight>
              {(productsById[item.product].price * item.qty).toLocaleString(
                undefined,
                {
                  style: "currency",
                  currency: "EUR",
                }
              )}
            </TableCellRight>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Basket;
