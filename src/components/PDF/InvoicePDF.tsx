import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import { Invoice } from '../../types';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 0, // On gère le padding à l'intérieur pour les bannières
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  // Conteneur de la bannière du haut
  headerBannerContainer: {
    position: 'relative',
    height: 120,
    width: '100%',
  },
  headerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  headerLeft: {
    color: '#000000',
  },
  invoiceTitleTop: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerInfo: {
    fontSize: 9,
    marginBottom: 2,
  },
  logo: {
    width: 120,
  },
  // Corps de la facture
  body: {
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  titleBox: {
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 8,
    padding: 10,
    textAlign: 'center',
    marginBottom: 20,
  },
  titleBoxText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clientSection: {
    marginBottom: 20,
  },
  clientText: {
    fontSize: 12,
  },
  bold: {
    fontWeight: 'bold',
  },
  // Table
  table: {
    width: '100%',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#9CA3AF',
  },
  tableHeaderCell: {
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderRightColor: '#9CA3AF',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#9CA3AF',
  },
  tableCell: {
    padding: 8,
    fontSize: 9,
    borderRightWidth: 1,
    borderRightColor: '#9CA3AF',
  },
  // Colonnes
  colQte: { width: '10%', textAlign: 'center' },
  colDes: { width: '50%' },
  colPu: { width: '20%', textAlign: 'right' },
  colMt: { width: '20%', textAlign: 'right' },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalLabelBox: {
    width: '20%',
    padding: 8,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    fontWeight: 'bold',
  },
  totalValueBox: {
    width: '20%',
    padding: 8,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  // Footer
  footerSection: {
    marginTop: 20,
  },
  totalWords: {
    fontSize: 10,
    marginBottom: 15,
  },
  paymentTerms: {
    marginTop: 10,
  },
  paymentTitle: {
    color: '#DC2626',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  // Bannière du bas
  bottomBannerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 100,
  }
});

const InvoicePDF: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('fr-FR').replace(/\s/g, ' ');
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER AVEC BANNIÈRE DIAGONALE */}
        <View style={styles.headerBannerContainer}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.invoiceTitleTop}>FACTURE</Text>
              <Text style={styles.headerInfo}>N° de facture : {invoice.invoiceNumber}</Text>
              <Text style={styles.headerInfo}>Date : {format(typeof invoice.date === 'string'
                                        ? new Date(invoice.date)
                                        : invoice.date && 'toDate' in invoice.date
                                        ? invoice.date.toDate()
                                        : (invoice.date as Date), 'dd/MM/yyyy')}</Text>
            </View>
            <Image src="/garage-logo.png" style={styles.logo} />
          </View>
          {/* <Svg height="120" width="600" style={{ position: 'absolute' }}>
            <Polygon points="0,0 600,0 600,80 0,120" fill="#9CA3AF" />
          </Svg> */}
        </View>

        <View style={styles.body}>
          {/* Boîte FACTURE centrée */}
          <View style={styles.titleBox}>
            <Text style={styles.titleBoxText}>FACTURE</Text>
          </View>

          {/* Client */}
          <View style={styles.clientSection}>
            <Text style={styles.clientText}>
              <Text style={styles.bold}>Client : </Text>{invoice.clientName}
            </Text>
          </View>

          {/* Tableau */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colQte]}>QTE</Text>
              <Text style={[styles.tableHeaderCell, styles.colDes]}>DESIGNATION</Text>
              <Text style={[styles.tableHeaderCell, styles.colPu]}>PRIX UNIT</Text>
              <Text style={[styles.tableHeaderCell, styles.colMt]}>MONTANT</Text>
            </View>

            {invoice.items.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colQte]}>{item.quantity.toString().padStart(2, '0')}</Text>
                <Text style={[styles.tableCell, styles.colDes]}>{item.designation}</Text>
                <Text style={[styles.tableCell, styles.colPu]}>{formatAmount(item.unitPrice)}</Text>
                <Text style={[styles.tableCell, styles.colMt]}>{formatAmount(item.amount)} F</Text>
              </View>
            ))}

            {invoice.deliveryFees > 0 && (
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colQte]}></Text>
                <Text style={[styles.tableCell, styles.colDes]}>Frais de livraison</Text>
                <Text style={[styles.tableCell, styles.colPu]}>{formatAmount(invoice.deliveryFees)}</Text>
                <Text style={[styles.tableCell, styles.colMt]}>{formatAmount(invoice.deliveryFees)} F</Text>
              </View>
            )}

            {invoice.laborCost > 0 && (
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '60%' }]}>Main d'œuvre</Text>
                <Text style={[styles.tableCell, styles.colPu]}>{formatAmount(invoice.laborCost)}</Text>
                <Text style={[styles.tableCell, styles.colMt]}>{formatAmount(invoice.laborCost)} F</Text>
              </View>
            )}
            
            <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colQte]}></Text>
                <Text style={[styles.tableCell, styles.colDes]}></Text>
                <Text style={[styles.tableCell, styles.colPu]}></Text>
                <Text style={[styles.tableCell, styles.colMt]}></Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colQte]}></Text>
                <Text style={[styles.tableCell, styles.colDes]}></Text>
                <Text style={[styles.tableCell, styles.colPu]}></Text>
                <Text style={[styles.tableCell, styles.colMt]}></Text>
              </View>

            {/* Ligne TOTAL */}
            <View style={styles.totalRow}>
                <Text style={[styles.totalLabelBox, { borderLeftWidth: 1 }]}>TOTAL</Text>
                <Text style={styles.totalValueBox}>{formatAmount(invoice.total)} F CFA</Text>
            </View>
          </View>

          {/* Arrêté de la somme */}
          <View style={styles.footerSection}>
            <Text style={styles.totalWords}>
              La présente facture est arrêtée à la somme de : <Text style={styles.bold}>{invoice.totalInWords}</Text>
            </Text>

            <View style={styles.paymentTerms}>
              <Text style={styles.paymentTitle}>Conditions et modalités de paiement</Text>
              <Text style={{ fontSize: 9 }}>Le paiement est effectué en espèces</Text>
            </View>
          </View>
        </View>

        {/* BANNIÈRE DU BAS DIAGONALE */}
        {/* <View style={styles.bottomBannerContainer}>
          <Svg height="100" width="600">
            <Polygon points="0,100 600,100 600,0 0,60" fill="#9CA3AF" />
          </Svg>
        </View> */}

      </Page>
    </Document>
  );
};

export const InvoicePDFDownloadLink: React.FC<{ invoice: Invoice }> = ({ invoice }) => (
  <PDFDownloadLink
    document={<InvoicePDF invoice={invoice} />}
    fileName={`facture-${invoice.invoiceNumber}.pdf`}
    style={{
      textDecoration: 'none',
      padding: '8px 12px',
      backgroundColor: '#000000',
      color: '#FFFFFF',
      border: '1px solid #D1D5DB',
      borderRadius: '4px',
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: '14px'
    }}
  >
    Télécharger
  </PDFDownloadLink>
);