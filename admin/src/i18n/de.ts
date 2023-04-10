import { TranslationMessages } from 'react-admin';
const germanMessages = require('ra-language-german');

const customgermanMessages: TranslationMessages = {
    ...germanMessages,
    pos: {
        search: 'Recherche',
        configuration: 'Konfiguration',
        language: 'Sprache',
        theme: {
            name: 'Thema',
            light: 'Licht',
            dark: 'Dunkel',
        },
        dashboard: {
            monthly_revenue: 'Monatlicher Umsatz',
            month_history: '30-tägige Umsatzübersicht',
            new_orders: 'Neue Bestellungen',
            pending_reviews: 'Pending Reviews',
            all_reviews: 'See all reviews',
            all_products: 'Alle Produkte',
            new_customers: 'Neue Kunden',
            new_products: 'Neue Produkte',
            revenue_by_products: 'Umsatz nach Produkte',
            revenue_by_month: 'Revenue By Month',
            revenue_by_calendarweeks: 'Revenue By CalendarWeeks',
            all_customers: 'Übersicht Kunden',
            pending_orders: 'offen Bestellungen',
            option_date: 'Datum',
            option_week: 'Kalenderwoche',
            label_week: 'Woche',
            label_nodata: 'keine Daten vorhanden',
            order: {
                items:
                    'by %{customer_name}, one item |||| by %{customer_name}, %{nb_items} items',
            },
            welcome: {
                title: 'Welcome to the react-admin e-commerce demo',
                subtitle:
                    "This is the admin of an imaginary poster shop. Feel free to explore and modify the data - it's local to your computer, and will reset each time you reload.",
                ra_button: 'react-admin site',
                demo_button: 'Source for this demo',
            },
        },
        menu: {
        },
        common: {
            edit_by: "Bearbeitet von"
        },
        bulk: {
            delete: {
                title: "Benutzer entfernen",
                content: "Sind Sie sicher?"
            }
        }
    },
    resources: {
        users: {
            name: 'Benutzer',
            actions: {
                download_license_zip: 'Dokumente herunterladen',
                send_mail_check_email: 'Signup E-Mail absenden',
                send_mail_proxy_password_email: 'vorläufiges-Passwort Mail absenden',
                verify: 'Nutzer verifizieren',
                cancel_verify: 'Nutzerverifizierung abbrechen',
                license_approve: 'Approve',
                license_reject: 'Reject',
                cancel: 'Abbrechen',
                document_open: 'Dokument öffnen',
            },
            fields: {
                email: 'E-Mail',
                invoice_email: 'Rechnungs-E-Mail-Adresse',
                name: 'Name',
                name_sir_code: 'Anrede',
                name_sir_title: 'Titel',
                name_first: 'Vorname Ansprechpartner',
                name_last: 'Nachname Ansprechpartner',
                address: 'Adresse',
                address_street: 'Staße',
                address_house: 'Hausnummer',
                address_zipcode: 'PLZ',
                address_city: 'Stadt',
                company_name: 'Firmenname',
                corporation_form: 'Gesellschaftsform',
                company_id_code: 'Institutskennzeichen',
                phone_number: 'Telefonnummer',
                fax_number: 'Fax',
                vat_id_code: 'Ust-Nr.',
                tax_id_code: 'Steuernummer',
                business_license: 'Betriebserlaubnis',
                business_license_required: 'Betriebserlaubnis (benötigt)',
                official_document: 'Handelsregisterauszug',
                additional_document: 'Weitere Dokumente',
                license_state: 'Betriebserlaubnis / Handelsregisterauszug',
                business_license_state: 'Betriebserlaubnis Status',
                official_document_state: 'Handelsregister Status',
                email_confirmed: 'E-Mail bestätigt',
                user_verified: 'Konto verifiziert?',
                edition_blocked: 'Bearbeitung sperren?',
                user_freezed: 'Konto gesperrt?',
                user_proxy: 'vorläufiger Nutzer',
                wrong_password_count: 'x Passwort ist falsch.',
                edition_count: 'x sperren',
                created_at: 'Erstellt am',
                updated_at: 'Zuletzt aktualisiert',
                first_seen: 'Zuerst gesehen',
                last_seen: 'Zuletzt gesehen',
                is_admin: 'Nutzerpasswort eingerichtet',
                password: 'Passwort',
                confirm_password: 'Passwort bestätigen',
                total_orders: 'Gesamtbestellungen',
                total_spent: 'Gesamt ausgegeben'
            },
            field_groups: {
                profile: 'Profil',
                identity: 'Identität',
                address: 'Adresse',
                set_password: 'Passwort einrichten',
                company: 'Apothekenname',
                state: 'Status',
                license: 'Dokumente',
                other: 'Sonstiges',
                action: 'Aktion',
            },
            constants: {
                select_fields: {
                    corporation_form: {
                        ohg: 'OHG',
                        ek: 'e.K.'
                    },
                    name_sir_code: {
                        mr: 'Herr',
                        mrs: 'Frau'
                    },
                    license_status: {
                        not_uploaded: "nicht hochgeladen",
                        uploaded: "hochgeladen",
                        rejected: "abgelehnt",
                        approved: "akzeptiert",
                    }
                }
            },
            errors: {
                create_user_error: 'Nutzer konnte nicht erstellt werden',
                update_user_error: 'Nutzer konnte nicht bearbeitet werden',
                no_approval_without_email_confirmation: 'Cannot approve license with email not confirmed user',
                no_business_license_state: 'No Business License State',
                no_official_document_state: 'No Official Document State',
                password_mismatch: 'Passwort stimmt nicht überein',
                no_business_license: 'No business license file!',
                action_without_license: 'Cannot perform action without uploading file',
                zipcode_not_valid: 'PLZ ungültig',
                tax_id_code_not_valid: 'Steuernummer ist ungültig',
                tax_id_code_not_min: 'Steuernummer muss mindestens aus 11 Ziffern bestehen',
                phone_number_not_valid: 'Telefonnummer ist ungültig'
            },
            messages: {
                send_mail_success: 'Email Sent!',
                send_mail_failed: 'Email Not Sent. Try again later',
                operation_success: 'Operation successed!',
                operation_failed: 'Operation failed'
            },
            filters: {
                last_visited: 'Zuletzt besucht',
                today: 'Heute',
                this_week: 'Diese Woche',
                last_week: 'Letzte Woche',
                this_month: 'Diesen Monat',
                last_month: 'Letzten Monat',
                earlier: 'Früher',
                has_ordered: 'bestellt',
                is_verified: 'Konto verifiziert',
                is_freezed: 'Konto gesperrt',
                clear_filter: 'Filter zurücksetzen'
            }
        },
        products: {
            name: 'Produkte',
            actions: {},
            fields: {
                name: 'Name',
                value_added_tax: 'Umsatzsteuer',
                price_net: 'Preis (Netto)',
                item_number: 'Artikelnummer',
                description: 'Beschreibung',
                images: 'Produktfoto',
                ingredients: 'Zutaten',
                consumption: 'Verzehrempfehlung',
                created_at: 'Erstellt am',
                updated_at: 'Zuletzt aktualisiert',
                upload_product_images: 'Produktfoto hochladen'
            },
            field_groups: {
                product_description: 'Beschreibung',
                product_ingredients: 'Zutaten',
                product_item_number: 'Artikelnummer',
                product_consumption: 'Verzehrempfehlung',
                product_images: 'Produktfotos',
            },
            constants: {},
            errors: {},
            messages: {},
            filters: {},
            sortby: {
                name: 'Sortieren nach'
            }
        },
        orders: {
            name: 'Bestellungen',
            title: 'Bestellungen %{reference}',
            status: {
                open: 'offen',
                pending: 'in Bearbeitung',
                done: 'abgeschlossen',
                cancelled: 'storniert',
                delivered: 'versendet',
            },
            constants: {
                status: {
                    open: 'offen',
                    done: 'abgeschlossen',
                    sent: 'versendet',
                    paid: 'bezahlt',
                    cancelled: 'storniert',
                    not_paid: 'nicht bezahlt',
                    pending: 'in Bearbeitung',
                }
            },
            actions: {
                return: 'Bestellung stornieren',
                cancel_return: 'Bestellung wiederherstellen',
                open: "Rechnung öffnen"
            },
            fields: {
                id: 'Kundennummer',
                user: 'Apothekenname',
                order_items: 'Bestellte Artikel',
                pharmacy_name: 'Apothekenname',
                delivery_address: 'Lieferadresse',
                total_price: 'Gesamtpreis',
                tax_price: 'Steuer',
                source: 'Bestelltyp',
                status: 'Bestellstatus',
                date_gte: 'Datum - Von',
                date_lte: 'Datum - Bis',
                reference: 'Reference',
                delivery_status: 'Lieferstatus',
                payment_status: 'Zahlungsstatus',
                received_payment_at: 'Zahlungseingang',
                expected_payment_at: 'vorauss. Zahlungseingang',
                cancelled: 'Abgebrochen',
                invoice: 'Rechnung',
                created_at: 'Erstellt am',
                updated_at: 'Zuletzt aktualisiert',
                order_item: {
                    product: 'Produkt',
                    name: 'Name',
                    price: 'Preis',
                    qty: 'Menge',
                    vat: 'Umsatzsteuer'
                },
                basket: {
                    delivery: 'Lieferung',
                    reference: 'Reference',
                    quantity: 'Menge',
                    sum: 'Summe',
                    tax_rate: 'Umsatzsteuer',
                    taxes: 'USt. (%{vat})',
                    total: 'Gesamtpreis',
                    unit_price: 'Einzelpreis',
                }
            },
            section: {
                order: 'Übersicht',
                customer: 'Kunde',
                pharmacy: 'Apothekenname',
                delivery_address: 'Lieferadresse',
                items: 'Artikel',
                payment: 'Zahlung',
                total: 'Gesamtpreis',
            },
            field_groups: {},
            errors: {},
            messages: {},
            filters: {},
            sortby: {
                name: 'Sortieren',
            }
        },
        invoices: {
            name: 'Rechnungen',
            title: 'Rechnung  %{reference}',
            fields: {
                id: 'Rechnungsnummer',
                user: 'Kunde',
                order: 'Bestellnummer',
                order_items: 'Bestellte Artikel',
                delivery_address: 'Adresse',
                total_price: 'Gesamtpreis',
                tax_price: 'Umsatzsteuer',
                url: 'Rechnung',
                created_at: 'Erstellt am',
                updated_at: 'Zuletzt geändert',
                date_gte: 'Datum - Von',
                date_lte: 'Datum - Bis',
                order_item: {
                    product: 'Produkt',
                    name: 'Name',
                    price: 'Preis',
                    qty: 'Menge',
                    vat: 'Umsatzsteuer'
                },
                basket: {
                    delivery: 'Lieferung',
                    reference: 'Reference',
                    quantity: 'Menge',
                    sum: 'Summe',
                    tax_rate: 'Umsatzsteuer',
                    taxes: 'VAT (%{vat})',
                    total: 'Gesamtpreis',
                    unit_price: 'Einzelpreis',
                }
            },
            actions: {
                download_invoice_zip: 'Download Invoice',
                open: "Rechnung öffnen"
            },
        },
        notifications : {
            name: 'Benachrichtigung',
            title: 'Benachrichtigung %{reference}',
            fields : {
                description: 'Beschreibung',
                user: 'Kunde',
                createdAt: 'Geschaffene Zeit',
            },
            alarm : {
                newUserCreated : 'Neuer Benutzer erstellt.',
                newOrderCreated : 'Neuer Auftrag erstellt.',
                UserUpdated : 'Benutzer aktualisiert.'
            }
        }
    },
};

export default customgermanMessages;
