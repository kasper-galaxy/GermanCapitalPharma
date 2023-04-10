import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { PDFDocument } from 'pdf-lib';
import { sendInvoiceEmail, sendInvoiceNotifyEmail } from '../utils/sendmail_sendgrid.js';
import fs from 'fs/promises';
import xml2js from 'xml2js';
import * as path from 'path';
import InvoicePDF from './invoice/InvoicePDF.js';
import { calcTaxPerVAT, formatDate, readFile } from './libs.js';

const template_file = 'ZUGFeRD-invoice.xml';
const temp_file = 'temp-invoice.xml';
const get_file_path = (fileName) => (`./files/${fileName}`);

async function AttachXMLtoInvoice(path, user, newOrder) {
    console.log('start attaching ', path);
    const pdfData = await fs.readFile(path);
    const pdfDoc = await PDFDocument.load(pdfData);
    await prepareXML(user, newOrder);
    const xmlData = await fs.readFile(get_file_path(temp_file));

    console.log('pdf Data ', pdfDoc);
    console.log('xml Data ', xmlData);
    // Add the PDF attachment
    await pdfDoc.attach(xmlData, template_file, {
        mimeType: 'application/xml',
        description: 'German Capital Pharma GmBH Invoice - ZUGFeRD',
        creationDate: new Date(),
        modificationDate: new Date(),
    })

    const newPdfData = await pdfDoc.save();
    const newFileData = await fs.writeFile(path, newPdfData);

    console.log('zugferd fifnished');
    return Buffer.from(newPdfData).toString('base64');
    // return newPdfData.toString("base64");
}

function stripJson(json, invoice){
    console.log('get start to working on stripping ', json, invoice);
    let doc = json['rsm:CrossIndustryDocument'];
    let header = doc['rsm:HeaderExchangedDocument'];
    let body = doc['rsm:SpecifiedSupplyChainTradeTransaction'];

    // Header
    header[0]['ram:ID'][0] = invoice['header']['id'];
    header[0]['ram:Name'][0] = invoice['header']['name'];
    header[0]['ram:IssueDateTime'][0]['udt:DateTimeString'][0]['_'] = invoice['header']['date'];
    json['rsm:CrossIndustryDocument']['rsm:HeaderExchangedDocument'] = header;
    
    console.log('parse Header >>>');
    // Body
    /// Party
    //// Seller
    body[0]['ram:ApplicableSupplyChainTradeAgreement'][0]['ram:SellerTradeParty'][0]['ram:Name'][0] = invoice['body']['party']['seller']['name'];
    body[0]['ram:ApplicableSupplyChainTradeAgreement'][0]['ram:SellerTradeParty'][0]['ram:PostalTradeAddress'][0]['ram:PostcodeCode'][0] = invoice['body']['party']['seller']['address']['zipcode'];
    body[0]['ram:ApplicableSupplyChainTradeAgreement'][0]['ram:SellerTradeParty'][0]['ram:PostalTradeAddress'][0]['ram:LineOne'][0] = invoice['body']['party']['seller']['address']['lineone'];
    body[0]['ram:ApplicableSupplyChainTradeAgreement'][0]['ram:SellerTradeParty'][0]['ram:PostalTradeAddress'][0]['ram:CityName'][0] = invoice['body']['party']['seller']['address']['city'];
    body[0]['ram:ApplicableSupplyChainTradeAgreement'][0]['ram:SellerTradeParty'][0]['ram:SpecifiedTaxRegistration'][0]['ram:ID'][0]['_'] = invoice['body']['party']['seller']['tax'];
    //// Buyer
    body[0]['ram:ApplicableSupplyChainTradeAgreement'][0]['ram:BuyerTradeParty'][0]['ram:Name'][0] = invoice['body']['party']['seller']['name'];
    body[0]['ram:ApplicableSupplyChainTradeAgreement'][0]['ram:BuyerTradeParty'][0]['ram:PostalTradeAddress'][0]['ram:PostcodeCode'][0] = invoice['body']['party']['buyer']['address']['zipcode'];
    body[0]['ram:ApplicableSupplyChainTradeAgreement'][0]['ram:BuyerTradeParty'][0]['ram:PostalTradeAddress'][0]['ram:LineOne'][0] = invoice['body']['party']['buyer']['address']['lineone'];
    body[0]['ram:ApplicableSupplyChainTradeAgreement'][0]['ram:BuyerTradeParty'][0]['ram:PostalTradeAddress'][0]['ram:CityName'][0] = invoice['body']['party']['buyer']['address']['city'];
    body[0]['ram:ApplicableSupplyChainTradeAgreement'][0]['ram:BuyerTradeParty'][0]['ram:SpecifiedTaxRegistration'][0]['ram:ID'][0]['_'] = invoice['body']['party']['buyer']['tax'];

    /// Delivery Date
    body[0]['ram:ApplicableSupplyChainTradeDelivery'][0]['ram:ActualDeliverySupplyChainEvent'][0]['ram:OccurrenceDateTime'][0]['udt:DateTimeString'][0]['_'] = invoice['body']['delivery_date']

    /// Settlement
    //// Vat

    let newVat = [];
    invoice['body']['settlement']['vat'].forEach(item => {
        let vat_item = JSON.parse(JSON.stringify(body[0]['ram:ApplicableSupplyChainTradeSettlement'][0]['ram:ApplicableTradeTax'][0]));
        vat_item['ram:CalculatedAmount'][0]['_'] = item['amount'];
        vat_item['ram:BasisAmount'][0]['_'] = item['base_amount'];
        vat_item['ram:ApplicablePercent'][0] = item['percent'];
        newVat.push(vat_item);
    });


    body[0]['ram:ApplicableSupplyChainTradeSettlement'][0]['ram:ApplicableTradeTax'] = newVat;

    //// Monetary
    body[0]['ram:ApplicableSupplyChainTradeSettlement'][0]['ram:SpecifiedTradeSettlementMonetarySummation'][0]['ram:LineTotalAmount'][0]['_'] = invoice['body']['settlement']['monetary']['line_total'];
    body[0]['ram:ApplicableSupplyChainTradeSettlement'][0]['ram:SpecifiedTradeSettlementMonetarySummation'][0]['ram:TaxBasisTotalAmount'][0]['_'] = invoice['body']['settlement']['monetary']['basis_total'];
    body[0]['ram:ApplicableSupplyChainTradeSettlement'][0]['ram:SpecifiedTradeSettlementMonetarySummation'][0]['ram:TaxTotalAmount'][0]['_'] = invoice['body']['settlement']['monetary']['tax_total'];
    body[0]['ram:ApplicableSupplyChainTradeSettlement'][0]['ram:SpecifiedTradeSettlementMonetarySummation'][0]['ram:GrandTotalAmount'][0]['_'] = invoice['body']['settlement']['monetary']['total'];

    /// Line
    let newLineItems = [];
    invoice['body']['line'].forEach(item => {
        let line_item = JSON.parse(JSON.stringify(body[0]['ram:IncludedSupplyChainTradeLineItem'][0]));
        line_item['ram:SpecifiedTradeProduct'][0]['ram:Name'][0] = item['name'];
        line_item['ram:SpecifiedSupplyChainTradeDelivery'][0]['ram:BilledQuantity'][0]['_'] = item['qty'];
        newLineItems.push(Object.assign({}, line_item));
    });
    body[0]['ram:IncludedSupplyChainTradeLineItem'] = newLineItems;
    json['rsm:CrossIndustryDocument']['rsm:SpecifiedSupplyChainTradeTransaction'] = body;
    
    console.log('parse Body 2 >>>');
    
    return json;
}

const prepareXML = async (user, order) => {
    console.log('prepare xml ', user, order)
    let vats = calcTaxPerVAT(order.orderItems);
    let invoice = {
        "header": {
            "id": order.id,
            "name": 'RECHNUNGS',
            "date": formatDate(new Date(), ''),
        },
        "body": {
            "party": {
                "seller": {
                    "name": "German Capital Pharma GmbH",
                    "address": {
                        "zipcode": "13357",
                        "lineone": "Badstr. 20",
                        "city": "Berlin",
                    },
                    "tax": "DE123456789"
                },
                "buyer": {
                    "name": `${user.nameFirst} ${user.nameLast}`,
                    "address": {
                        "zipcode": user.addressZipCode,
                        "lineone": `${user.addressStreet} ${user.addressHouse}`,
                        "city": user.addressCity,
                    },
                    "tax": user.taxIdCode
                }
            },
            "delivery_date": formatDate(new Date(), ''),
            "settlement": {
                "vat": vats.map(item => ({
                    "amount": Number(item.sum).toFixed(2),
                    "base_amount": Number(item.base).toFixed(2),
                    "percent": `${Number(item.vat  * 100).toFixed(2)}`
                })),
                "monetary": {
                    "line_total": order.totalPrice - order.taxPrice,
                    "basis_total": order.totalPrice - order.taxPrice,
                    "tax_total": order.taxPrice,
                    "total": order.totalPrice
                }
            },
            "line": order.orderItems.map(item => ({
                "name": item.name,
                "qty": `${item.qty}.0000`
            }))
        }
    };
    console.log('invoice ready ', invoice);
    let data = readFile(get_file_path(template_file));
    let parser = new xml2js.Parser();
    console.log('loading xml ...');
    const res = await parser.parseStringPromise(data).then(res => {
        return res;
    });
    console.log('load xml ', res);
    let json = stripJson(res, invoice);
    console.log('json ready ', json);
    const builder = new xml2js.Builder();
    const xml = builder.buildObject(json);

    // write updated XML string to a file
    console.log('writing to temp file');
    const file = await fs.writeFile(get_file_path(temp_file), xml);
    return file;
};

export default async function CreateInvoice(user, newOrder) {
    console.log('reading pdf ...');
    console.log(user.invoiceEmail);
    console.log(user.email);
    const email = user.invoiceEmail ? user.invoiceEmail : user.email;
    // newOrder.user = user;
    console.log(email);

    const __dirname = path.resolve();
    const uploadPath = path.join(__dirname, '/upload');
    const filePath = path.join(uploadPath, `${newOrder.id}.pdf`);
    // const path = `upload/${newOrder.id}.pdf`;
    await ReactPDF.renderToFile(<InvoicePDF newOrder={newOrder} user={user} />, filePath);

    console.log('finished loading ... ');

    const newPdfData = await AttachXMLtoInvoice(filePath, user, newOrder);
    sendInvoiceNotifyEmail({email: user.email, id: newOrder.id});
    sendInvoiceEmail({email, attachment: newPdfData, id: newOrder.id});
    return `upload/${newOrder.id}.pdf`;
}