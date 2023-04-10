import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Box from '@material-ui/core/Box';
import { makeStyles} from '@material-ui/core/styles';
import Meta from '../components/Meta';
import { useTranslation } from 'react-i18next';
import { COLOR_LOGO_PAGE_PRIMARY } from '../constants/color.constants';

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
  },
  form: {
    '& > *': {
      marginBottom: 16,
    },
  },
  content: {
    padding: 24,
    boxShadow: '0 10px 31px 0 rgba(0,0,0,0.05)',
  },
  boxContainer: {
    position: 'relative',
    ...theme.mixins.customize.flexMixin('center', 'center', 'column'),
    height: '100%',
  },
}));

const DataPrivacyScreen = ({ history }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Container maxWidth='xl' style={{ marginBottom: 48 }}>
      <Meta title={t('DataPrivacy') + ' | ' + t('PharmacyStore')} />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
            
        </Grid>
      </Grid>
      <Box>
        <Paper elevation={0} className={classes.content} square >
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Typography variant='h6' gutterBottom style={{}}>
                {`Please note that due to legal reasons, the legally binding variant of
                    this document is only available in German. If you have questions regarding
                    the privacy statement, please contact us.`}
              </Typography> <br />
              <Typography variant='h3' gutterBottom>
                {t('DataPrivacy')}
              </Typography>
              <Typography variant='body1' gutterBottom>
                {`
                    Wir freuen uns über Ihren Besuch auf unserer Webseite www.gc-pharma.de und Ihr
                    Interesse an unserem Unternehmen und unseren Angeboten. Für externe Links zu
                    fremden Inhalten übernehmen wir trotz sorgfältiger inhaltlicher Kontrolle keine
                    Haftung, da wir die Übermittlung dieser Information nicht veranlassen, den
                    Adressaten der übermittelten Information und die übermittelten Informationen
                    selbst nicht ausgewählt oder verändert haben.
                    `} <br /><br /> {`
                    Der Schutz Ihrer personenbezogenen Daten bei der Erhebung, Verarbeitung und
                    Nutzung anlässlich Ihres Besuchs auf unseren Internetseiten ist uns ein
                    wichtiges Anliegen und erfolgt im Rahmen der gesetzlichen Vorschriften,
                    über die Sie sich z.B. unter www.bfd.bund.de informieren können.
                    `} <br /><br /> {`
                    Im Folgenden erläutern wir Ihnen, welche Informationen wir während Ihres
                    Besuchs auf unseren Webseiten erfassen und wie diese genutzt werden:
                `}
              </Typography> <br />
              <Typography variant='h4' style={{ color: COLOR_LOGO_PAGE_PRIMARY }} gutterBottom>
                {`1. Erhebung und Speicherung personenbezogener Daten sowie Art und Zweck von deren Verwendung`}
              </Typography>
              <Typography variant='body1' gutterBottom>
                {`
                    a) Beim Besuch der Webseite
                `} <br /><br /> {`
                    Bei jedem Zugriff eines Kunden (oder sonstigen Besuchers) auf unserer
                    Webseite werden durch den auf Ihrem Endgerät (Computer, Laptop, Tablet,
                    Smartphone, etc.) zum Einsatz kommenden Internet-Browser automatisch
                    Informationen an den Server unserer Webseite gesendet. Diese Informationen
                    werden temporär in einem sog. Logfile (Protokolldatei) gespeichert.
                `} <br /><br /> {`
                    Folgende Daten werden dabei ohne Ihr Zutun erfasst und bis zur
                    automatisierten Löschung gespeichert:
                `}
              </Typography> <br />
            <List dense>
                <ListItem>
                    <ListItemIcon>
                        <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={`IP-Adresse des anfragenden Rechners, sowie Geräte-ID oder
                        individuelle Geräte-Kennung und Gerätetyp,`}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={`Name der abgerufenen Datei und übertragene Datenmenge, sowie Datum
                        und Uhrzeit des Abrufs,`}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={`Meldung über erfolgreichen Abruf,`}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={`anfragende Domain,`}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={`Beschreibung des Typs des verwendeten Internet-Browsers und ggf. des
                        Betriebssystems Ihres Endgeräts sowie der Name Ihres
                        Access-Providers,`}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={`Ihre Browser-Verlaufsdaten sowie Ihre standardmäßigen
                        Weblog-Informationen`}
                    />
                </ListItem>
            </List> <br />
            <Typography variant='body1' gutterBottom>
            {`
                Unser berechtigtes Interesse gem. Art. 6 Abs. 1 S. 1 lit. f DSGVO zur
                Erhebung der Daten beruht auf den folgenden Zwecken: Gewährleistung eines
                reibungslosen Verbindungsaufbaus und einer komfortablen Nutzung der
                Webseite, Auswertung der Systemsicherheit und -stabilität sowie zu
                weiteren administrativen Zwecken.
            `} <br /><br /> {`
                In keinem Fall verwenden wir die erhobenen Daten zu dem Zweck, Rückschlüsse auf Ihre Person zu ziehen.
            `} <br /><br /> {`
                b) Bei Abschluss eines Vertragsverhältnisses
            `} <br /><br /> {`
                Bei Abschluss eines Vertragsverhältnisses auf unserer Webseite bitten
                wir Sie um die Angaben folgender personenbezogener Daten:
            `} <br /><br /> {`
                weitere personenbezogene Daten, zu deren Erfassung und Verarbeitung wir
                gesetzlich verpflichtet oder berechtigt sind und die wir für Ihre
                Authentifizierung, Identifizierung oder zur Überprüfung der von uns erhobenen
                Daten benötigen.
            `} <br /><br /> {`
                Die genannten Daten werden zur Abwicklung des Vertragsverhältnisses
                verarbeitet. Die Verarbeitung der Daten erfolgt aufgrund von Art. 6 Abs. 1 lit.
                b DSGVO. Die Speicherfrist ist auf den Vertragszweck und, sofern vorhanden,
                gesetzliche und vertragliche Aufbewahrungspflichten beschränkt.
            `}
            </Typography> <br />
            <Typography variant='h4' style={{ color: COLOR_LOGO_PAGE_PRIMARY }} gutterBottom>
                {`2. Weitergabe von personenbezogenen Daten`}
            </Typography>
            <Typography variant='body1' gutterBottom>
            {`
                Eine Übermittlung Ihrer Daten an Dritte zu anderen als den im Folgenden
                aufgeführten Zwecken findet nicht statt.
            `} <br /><br /> {`
                Wir geben Ihre Daten nur an Dritte weiter, wenn:
            `}
            </Typography> <br />
            <List dense>
                <ListItem>
                    <ListItemIcon>
                        <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={`Sie eine ausdrückliche Einwilligung dazu erteilt haben nach (Art. 6
                            Abs. 1 S. 1 lit. a DSGVO),`}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={`dies für die Abwicklung von Vertragsverhältnissen mit Ihnen
                            erforderlich ist (Art. 6 Abs. 1 lit. b DSGVO),`}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={`eine gesetzliche Verpflichtung zur Weitergabe besteht (Art.6 Abs.1
                            lit. c DSGVO),`}
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <ArrowRightIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={`die Weitergabe zur Geltendmachung, Ausübung oder Verteidigung von
                            Rechtsansprüchen erforderlich ist und kein Grund zur Annahme besteht,
                            dass Sie ein überwiegendes schutzwürdiges Interesse an der
                            Nichtweitergabe Ihrer Daten haben (Art. 6 Abs. 1 S. 1 lit. f DSGVO).
                            In diesen Fällen beschränkt sich der Umfang der übermittelten Daten
                            jedoch nur auf das erforderliche Minimum.`}
                    />
                </ListItem>
            </List> <br />
            <Typography variant='body1' gutterBottom>
            {`
                Unsere Datenschutzbestimmungen stehen im Einklang mit den geltenden
                datenschutzrechtlichen Bestimmungen und die Daten werden nur in der
                Bundesrepublik Deutschland / Europäischen Union verarbeitet. Eine
                Übermittlung in Drittländer findet nicht statt und ist nicht
                beabsichtigt.
            `}
            </Typography> <br />
            <Typography variant='h4' style={{ color: COLOR_LOGO_PAGE_PRIMARY }} gutterBottom>
                {`3. Betroffenenrechte`}
            </Typography>
            <Typography variant='body1' gutterBottom>
            {`
                Auf Anfrage werden wir Sie gern informieren, ob und welche
                personenbezogenen Daten zu Ihrer Person gespeichert sind (Art. 16 DSGVO),
                insbesondere über die Verarbeitungszwecke, die Kategorie der
                personenbezogenen Daten, die Kategorien von Empfängern, gegenüber denen
                Ihre Daten offengelegt wurden oder werden, die geplante Speicherdauer,
                das Bestehen eines Rechts auf Berichtigung, Löschung, Einschränkung der
                Verarbeitung oder Widerspruch, das Bestehen eines Beschwerderechts, die
                Herkunft ihrer Daten, sofern diese nicht bei uns erhoben wurden, sowie
                über das Bestehen einer automatisierten Entscheidungsfindung
                einschließlich Profiling.
            `} <br /><br /> {`
                Ihnen steht zudem das Recht zu, etwaig unrichtig erhobene
                personenbezogene Daten berichtigen oder unvollständig erhobene Daten
                vervollständigen zu lassen (Art. 16 DSGVO).
            `} <br /><br /> {`
                Ferner haben Sie das Recht, von uns die Einschränkung der Verarbeitung
                Ihrer Daten zu verlangen, sofern die gesetzlichen Voraussetzungen hierfür
                vorliegen (Art. 18 DSGVO).
            `} <br /><br /> {`
                Sie haben das Recht, die Sie betreffenden personenbezogenen Daten in
                einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten
                oder die Übermittlung an einen anderen Verantwortlichen zu verlangen
                (Art. 20 DSGVO).
            `} <br /><br /> {`
                Darüber hinaus steht Ihnen das sogenannte „Recht auf Vergessenwerden“
                zu, d.h. Sie können von uns die Löschung Ihrer personenbezogenen Daten
                verlangen, sofern hierfür die gesetzlichen Voraussetzungen vorliegen
                (Art. 17 DSGVO).
            `} <br /><br /> {`
                Unabhängig davon werden Ihre personenbezogenen Daten automatisch von uns
                gelöscht, wenn der Zweck der Datenerhebung weggefallen oder die
                Datenverarbeitung unrechtmäßig erfolgt ist.
            `} <br /><br /> {`
                Gemäß Art. 7 Abs. 3 DSGVO haben Sie das Recht Ihre einmal erteilte
                Einwilligung jederzeit gegenüber uns zu widerrufen. Dies hat zur Folge,
                dass wir die Datenverarbeitung, die auf dieser Einwilligung beruhte, für
                die Zukunft nicht mehr fortführen dürfen.
            `} <br /><br /> {`
                Sie haben zudem das Recht, jederzeit gegen die Verarbeitung Ihrer
                personenbezogenen Daten Widerspruch zu erheben, sofern ein
                Widerspruchsrecht gesetzlich vorgesehen ist. Im Falle eines wirksamen
                Widerrufs werden Ihre personenbezogenen Daten ebenfalls automatisch durch
                uns gelöscht (Art. 21 DSGVO).
            `} <br /><br /> {`
                Möchten Sie von Ihrem Widerrufs- oder Widerspruchsrecht Gebrauch machen,
                genügt eine E-Mail an: privacy@gc-pharma.de.
            `} <br /><br /> {`
                Bei Verstößen gegen die datenschutzrechtlichen Vorschriften haben Sie
                gem. Art. 77 DSGVO die Möglichkeit, Beschwerde bei einer Aufsichtsbehörde
                zu erheben.
            `}
            </Typography> <br />
            <Typography variant='h4' style={{ color: COLOR_LOGO_PAGE_PRIMARY }} gutterBottom>
                {`4. Dauer der Datenspeicherung`}
            </Typography>
            <Typography variant='body1' gutterBottom>
            {`
                Die erhobenen Daten werden solange bei uns gespeichert, wie dies für die
                Durchführung der mit uns eingegangen Verträge erforderlich ist oder Sie Ihr
                Recht auf Löschung oder Ihr Recht auf Datenübertragung auf ein anderes
                Unternehmen nicht ausgeübt haben.
            `}
            </Typography> <br />
            <Typography variant='h4' style={{ color: COLOR_LOGO_PAGE_PRIMARY }} gutterBottom>
                {`5. Cookies`}
            </Typography>
            <Typography variant='body1' gutterBottom>
            {`
                Wir setzen auf unserer Webseite keine Cookies ein.
            `}
            </Typography> <br />
            <Typography variant='h4' style={{ color: COLOR_LOGO_PAGE_PRIMARY }} gutterBottom>
                {`6. Online-Marketing/ Analyse-Tools`}
            </Typography>
            <Typography variant='body1' gutterBottom>
            {`
                keine
            `}
            </Typography> <br />
            <Typography variant='h4' style={{ color: COLOR_LOGO_PAGE_PRIMARY }} gutterBottom>
                {`Links zu unseren Internetauftritten in sozialen Netzwerken`}
            </Typography>
            <Typography variant='body1' gutterBottom>
            {`
                Auf unserer Webseite haben wir Links zu unseren Internetauftritten in den
                sozialen Netzwerken eingebunden. Wir weisen darauf hin, dass es sich hierbei
                nur um Verlinkungen handelt, die zu unserem Internetauftritt in den genannten
                Netzwerken weiterleiten, es handelt sich nicht um sog. Plugins, mit denen Sie
                bspw. Informationen auf unserer Webseite in den Netzwerken „teilen“ oder
                „liken“ könnten. Soweit uns bekannt ist, ist es technisch nicht möglich, dass
                soziale Netzwerke über die bloßen Verlinkungen personenbezogene Daten auf
                unserer Webseite erheben können. Zweck und Umfang der Datenerhebung nach der
                Weiterleitung entnehmen Sie bitte den Datenschutzinformationen des jeweiligen
                Netzwerkes.
            `}
            </Typography> <br />
            <Typography variant='h4' style={{ color: COLOR_LOGO_PAGE_PRIMARY }} gutterBottom>
                {`Datensicherheit`}
            </Typography>
            <Typography variant='body1' gutterBottom>
            {`
                Wir sind um alle notwendigen technischen und organisatorischen
                Sicherheitsmaßnahmen bemüht, um Ihre personenbezogenen Daten so zu
                speichern, dass sie weder Dritten noch der Öffentlichkeit zugänglich
                sind. Sollten Sie mit uns per E-Mail in Kontakt treten wollen, so weisen
                wir Sie darauf hin, dass bei diesem Kommunikationsweg die Vertraulichkeit
                der übermittelten Informationen nicht vollständig gewährleistet werden
                kann. Wir empfehlen Ihnen daher, uns vertrauliche Informationen
                ausschließlich über den Postweg zukommen zu lassen.
            `}
            </Typography> <br />
            <Typography variant='h4' style={{ color: COLOR_LOGO_PAGE_PRIMARY }} gutterBottom>
                {`Aktualität und Änderung dieser Datenschutzerklärung`}
            </Typography>
            <Typography variant='body1' gutterBottom>
            {`
                Diese Datenschutzerklärung ist aktuell gültig.
            `} <br />
            {`
                Durch die Weiterentwicklung unserer Webseite und Angebote darüber oder
                aufgrund geänderter gesetzlicher beziehungsweise behördlicher Vorgaben
                kann es notwendig werden, diese Datenschutzerklärung zu ändern. Die
                jeweils aktuelle Datenschutzerklärung kann jederzeit auf der Webseite
                unter https://gc-pharma.de/de/datenschutzerklaerung.html von Ihnen
                abgerufen und ausgedruckt werden.
            `}
            </Typography> <br />
            <Typography variant='h4' style={{ color: COLOR_LOGO_PAGE_PRIMARY }} gutterBottom>
                {`Name und Kontaktdaten des für die Verarbeitung Verantwortlichen`}
            </Typography>
            <Typography variant='body1' gutterBottom>
            {`
                Diese Datenschutz-Information gilt für die Datenverarbeitung durch:
            `} <br />
            {`
                German Capital Pharma GmbH, Badstr. 20, 13357 Berlin, Tel. 030 120 534 070, privacy@gc-pharma.de
            `}
            </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default DataPrivacyScreen;
