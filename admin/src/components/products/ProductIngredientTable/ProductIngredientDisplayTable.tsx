import { Paper, TableCell, TableContainer, TableHead, TableRow, Table, TableBody } from "@mui/material";
import React, { useEffect, useReducer } from "react";
import { useRecordContext } from "react-admin";
import { Product } from "../../../types";

const ProductIngredientDisplayTable = ({...props}) => {
    const record = useRecordContext<Product>(props);
    if (!record)    return null;
    console.log('dispaly table, ', record.ingredients);
    const { columns, data } = record.ingredients;

    let cols = [...columns];
    cols.pop();

    return (
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {cols.map((col: any) => (<TableCell align="left" style={{ width: '15%' }}>{col.label}</TableCell>))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: any) => (
              <TableRow
                key={row[cols[0].id]}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {cols.map((col: any) => (<TableCell align="left">{row[col.id]}</TableCell>))}
                {/* <TableCell component="th" scope="row">
                  {row.name}
            </TableCell>*/}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
};

export default ProductIngredientDisplayTable;