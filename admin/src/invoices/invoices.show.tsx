import * as React from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import {
  FileField,
  ReferenceField,
  TextField,
  useRecordContext,
  useTranslate,
} from "react-admin";

import Basket from "../orders/Basket";
import { Invoice, User } from "../types";

const InvoiceShow = () => {
  const record = useRecordContext<Invoice>();
  const translate = useTranslate();
  if (!record) return null;
  return (
    <Card sx={{ width: 600, margin: "auto" }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>
              German Capital Pharma GmbH
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom align="right">
              {translate("resources.invoices.fields.invoice")} #{record.counter}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} container alignContent="flex-end">
            <ReferenceField reference="users" source="user" link={false}>
              <CustomerField />
            </ReferenceField>
          </Grid>
        </Grid>
        <Box height={20}>&nbsp;</Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom align="center">
              {translate("resources.invoices.fields.date")}{" "}
            </Typography>
            <Typography gutterBottom align="center">
              {new Date(record.createdAt).toLocaleDateString()}
            </Typography>
          </Grid>

          <Grid item xs={5}>
            <Typography variant="h6" gutterBottom align="center">
              {translate("resources.invoices.fields.order")}
            </Typography>
            <ReferenceField reference="orders" source="order" link={"show"}>
              <TextField
                source="id"
                align="center"
                component="p"
                gutterBottom
              />
            </ReferenceField>
          </Grid>
        </Grid>
        <Box margin="10px 0">
          <ReferenceField reference="orders" source="order" link={false}>
            <Basket />
          </ReferenceField>
        </Box>
      </CardContent>
    </Card>
  );
};

const CustomerField = () => {
  const record = useRecordContext<User>();
  return record ? (
    <Typography>
      {record.nameFirst} {record.nameLast}
      <br />
      {record.addressStreet} {record.addressHouse}
      <br />
      {record.addressCity}, {record.addressZipCode}
    </Typography>
  ) : null;
};

export default InvoiceShow;
