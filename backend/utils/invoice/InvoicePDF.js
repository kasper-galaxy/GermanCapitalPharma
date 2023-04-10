import React from 'react';
import { Document, Page, Image, StyleSheet, Text, View, Font } from '@react-pdf/renderer';
import InvoiceItemsTable from './InvoiceItemsTable.js';
import invoice from './invoice.js';
import { calcTaxPerVAT, currencyFormatter, formatDate, taxFormatter } from '../libs.js';

// Font.register({ family: 'PF Din Text Universal', fonts: [
//     {
//         src: './files/fonts/PF\ Din\ Text\ Universal\ Light.woff'
//     }, 
//     {
//         src: './files/fonts/PF\ Din\ Text\ Universal\ Bold.woff', fontWeight: 600
//     }
// ] });

const styles = StyleSheet.create({
    page: {
        // fontFamily: 'PF Din Text Universal',
        fontSize: 11,
        paddingTop: 266,
        paddingBottom: 160,
        lineHeight: 1.5
    },
    marginContainer: {
        paddingLeft:60,
        paddingRight:60,
        flexDirection: 'column'
    },
    logoContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    logo: {
        marginTop: 24,
        width: 207,
        height: 95
    },
    logoText: {
        fontSize: 8,
        color: 'gray',
        marginTop: 80
    },
    logoSubText: {
        fontSize: 8,
        color: 'black'
    },
    pageNumberText: {
        fontSize: 8,
        marginTop: 12,
        color: 'gray'
    },
    headerContainer: {
        flexDirection: 'row',
        marginTop: 36,
        height:96,
        justifyContent: 'flex-end'
    },
    headerSectionContainer: {
        width: '50%',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    headerSectionHeaderRowContainer: {
        flexDirection: 'coloumn',
        justifyContent: 'center'
    },
    headerSectionRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 1,
        marginBottom: 1
    },
    tableContainer: {
        flexDirection: 'column'
    },
    tableSectionContainer: {
        marginTop: 8,
        marginBottom: 8
    },
    tableSumContainer: {
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    tableSumSectionContainer: {
        width: '50%',
        flexDirection: 'column'
    },
    tableSumRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 1,
        marginBottom: 1,
        padding: 4
    },
    tableSumTotalRowContainer: {
        backgroundColor: 'lightgrey',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 2,
        marginBottom: 2,
        padding: 6
    },
    conditionsContainer: {
        marginTop: 36,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    conditionsContentContainer: {
        height: 24,
    },
    Header: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        color: 'lightgrey'
    },
    Body: {
        marginTop: 8,
        marginBottom: 8
    },
    Footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 20,
        color: 'lightgrey'
    },
    footerContainer: {
        flexDirection: 'column',
        justifyContent: 'center'
    },
    footerRowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 2,
        marginBottom: 2
    },
    divider: {
        height: 1,
        marginTop: 8,
        marginBottom: 8,
        backgroundColor: 'lightgray'
    },
    text: {
        fontSize: 10
    },
    boldText: {
        fontSize: 10,
        fontWeight: 600,
        color: 'black'
    },
    labelBoldText: {
        fontSize: 9,
        fontWeight: 600,
        color: 'gray'
    },
    labelText: {
        fontSize: 8,
        color: 'gray'
    },
    labelMargin: {
        marginLeft: 4,
        marginRight: 4
    },
    labelMarginLeft: {
        marginLeft: 4
    },
    labelMarginRight: {
        marginRight: 4
    }
});

const InvoicePDF = ({ newOrder, user }) => {
    const {
        companyName,
        corporationForm,
        nameFirst,
        nameLast,
        addressStreet,
        addressHouse,
        addressCity,
        addressZipCode
    } = user;

    return <Document>
        <Page size='A4' style={styles.page}>
            <View style={styles.Header} fixed>
                <div style={styles.marginContainer}>
                    <div style={styles.logoContainer}>
                        <div>
                            <Text style={styles.logoText}>German Capital Pharma GmbH Badstr. 20 - 13357 Berlin</Text>
                            <div style={{ height:1, backgroundColor: 'black', marginTop: 2, marginBottom: 4 }}></div>
                            <Text style={styles.logoSubText}>{companyName} {corporationForm}</Text>
                            <Text style={styles.logoSubText}>{nameFirst} {nameLast}</Text>
                            <Text style={styles.logoSubText}>{addressHouse} {addressStreet}</Text>
                            <Text style={styles.logoSubText}>{addressZipCode} {addressCity}</Text>
                        </div>
                        <Image style={styles.logo} src={'./files/logo.png'} />                                
                    </div>
                    <div style={styles.headerContainer}>
                        <div style={styles.headerSectionContainer}>
                            <div style={styles.headerSectionHeaderRowContainer}>
                                <div style={styles.headerSectionRowContainer}>
                                    <div><Text style={styles.labelBoldText}>Rechnung zu Bestellung</Text></div>
                                    <div><Text style={styles.boldText}>{newOrder.id}</Text></div>
                                </div>
                                <div style={{ height:1, backgroundColor: 'gray', marginTop: 2, marginBottom: 4 }}></div>
                            </div>
                            <div style={styles.headerSectionRowContainer}>
                                <div><Text style={styles.labelText}>Rechnungsnummer</Text></div>
                                <div><Text style={styles.boldText}>OR_{String(newOrder.counter).padStart(5, '0')}</Text></div>
                            </div>
                            <div style={styles.headerSectionRowContainer}>
                                <div><Text style={styles.labelText}>Rechnungsdatum</Text></div>
                                <div><Text style={styles.boldText}>{formatDate(newOrder.createdAt, '.')}</Text></div>
                            </div>
                            <div style={styles.headerSectionRowContainer}>
                                <div><Text style={styles.labelBoldText}>Fälligkeitsdatum</Text></div>
                                <div><Text style={styles.boldText}>{formatDate(newOrder.expectedPaymentAt ? newOrder.expectedPaymentAt : newOrder.receivedPaymentAt, '.')}</Text></div>
                            </div>
                        </div>
                    </div>
                </div>
            </View>
            
            <View style={styles.Body}>
                <div style={styles.marginContainer}>
                    <div style={styles.tableContainer}>
                        <div style={styles.tableSectionContainer}>
                            <InvoiceItemsTable items={newOrder.orderItems} />
                        </div>
                        <div style={styles.tableSumContainer}>
                            <div style={styles.tableSumSectionContainer}>
                                <div style={styles.tableSumRowContainer}>
                                    <Text style={styles.text}>Zwischensumme ohne USt.</Text>
                                    <Text style={styles.text}>{currencyFormatter.format(newOrder.netPrice)}</Text>
                                </div>
                                {
                                    calcTaxPerVAT(newOrder.orderItems).map(item => (
                                        <div style={styles.tableSumRowContainer} key={item.vat}>
                                            <Text style={styles.text}>USt. {taxFormatter.format(item.vat)} von</Text>
                                            <Text style={styles.text}>{currencyFormatter.format(item.sum)}</Text>
                                        </div>
                                    ))
                                }
                                <div style={styles.tableSumTotalRowContainer}>
                                    <Text style={styles.boldText}>Gesamtpreis EUR</Text>
                                    <Text style={styles.boldText}>{currencyFormatter.format(newOrder.totalPrice)}</Text>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={styles.conditionsContainer}>
                        <Text style={styles.text}>Es gelten unsere AGB und Retourenbedingungen.</Text>
                    </div>
                    <div style={styles.conditionsContentContainer}>

                    </div>
                </div>
            </View>

            <View style={styles.Footer} fixed>
                <div style={styles.divider}></div>
                <div style={styles.marginContainer}>
                    <div style={styles.footerContainer}>
                        <View style={styles.footerRowContainer}>
                            <Text style={styles.labelBoldText}>German Capital Pharma GmbH</Text>
                            <Text style={[styles.labelText, styles.labelMargin]}>Badstr. 20 - 13357 Berlin</Text>
                            <Text style={[styles.labelBoldText, styles.labelMarginLeft]}>E-Mail: </Text>
                            <Text style={[styles.labelText, styles.labelMarginRight]}>office@gc-pharma.de</Text>
                            <Text style={[styles.labelBoldText, styles.labelMarginLeft]}>Telefon: </Text>
                            <Text style={[styles.labelText, styles.labelMarginRight]}>030 120 534 070</Text>
                        </View>
                        <View style={styles.footerRowContainer}>
                            <Text style={[styles.labelBoldText, styles.labelMarginLeft]}>Webseite: </Text>
                            <Text style={[styles.labelText, styles.labelMarginRight]}>www.gc-pharma.de</Text>
                            <Text style={[styles.labelBoldText, styles.labelMarginLeft]}>Steuernummer: </Text>
                            <Text style={[styles.labelText, styles.labelMarginRight]}>30/305/50177</Text>
                            <Text style={[styles.labelBoldText, styles.labelMarginLeft]}>USt.-IdNr.: </Text>
                            <Text style={[styles.labelText, styles.labelMarginRight]}>DE309937854</Text>
                            <Text style={[styles.labelBoldText, styles.labelMarginLeft]}>Geschäftsführer: </Text>
                            <Text style={[styles.labelText, styles.labelMarginRight]}>Skender Berisha</Text>
                        </View>
                        <View style={styles.footerRowContainer}>
                            <Text style={[styles.labelBoldText, styles.labelMarginLeft]}>Amtsgericht: </Text>
                            <Text style={[styles.labelText, styles.labelMarginRight]}>Berlin-Charlottenburg</Text>
                            <Text style={[styles.labelBoldText, styles.labelMarginLeft]}>Handelsregister: </Text>
                            <Text style={[styles.labelText, styles.labelMarginRight]}>HRB 183102 B</Text>
                            <Text style={[styles.labelBoldText, styles.labelMarginLeft]}>Bank: </Text>
                            <Text style={[styles.labelText, styles.labelMarginRight]}>Deutsche Apotheker</Text>
                        </View>
                        <View style={styles.footerRowContainer}>
                            <Text style={[styles.labelBoldText, styles.labelMarginLeft]}>Kontoinhaber: </Text>
                            <Text style={[styles.labelText, styles.labelMarginRight]}>German Capital Pharma GmbH</Text>
                            <Text style={[styles.labelBoldText, styles.labelMarginLeft]}>BIC: </Text>
                            <Text style={[styles.labelText, styles.labelMarginRight]}>DAAEDEDDXXX</Text>
                            <Text style={[styles.labelBoldText, styles.labelMarginLeft]}>IBAN: </Text>
                            <Text style={[styles.labelText, styles.labelMarginRight]}>DE63 3006 0601 0007 0881 72</Text>
                        </View>
                        <View style={styles.footerRowContainer}>
                            <Text style={styles.pageNumberText} render={({pageNumber, totalPages}) => (`Seite ${pageNumber} von ${totalPages} von Rechnung  #${newOrder.counter}`)}></Text>
                        </View>
                    </div>
                </div>
            </View>
        </Page>
    </Document>;
};

export default InvoicePDF;