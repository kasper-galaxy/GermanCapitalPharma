import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
      debug: true,
      fallbackLng: 'de',
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      resources: {
          gb: {
            translation: {
                PharmacyStore: "Pharmacy Store",

                // Messages
                Welcome: "Welome to German Capital Pharma",
                ThanksRegister: "Thank you for your registration. You will receive an email shortly. Please check your mailbox.",
                PasswordSetSuccess: "Password set successful, you can now login.",
                PasswordResetSuccess: "Password reset successful, please check your mailbox.",
                ProfileUpdateSuccess: "Profile updated successfully.",
                LicenseUploadSuccess: "License uploaded successfully.",
                AccountNotVerified: "Your account has not yet been verified.",
                EditionBlocked: "You made changes in your profile over twice, cannot continue to update.",
                PriceChanged: "Please note that product prices may have changed.",

                // Pages
                Home: "Start",
                Shop: "Shop",
                Cart: "Cart",
                Dashboard: "Dashboard",
                Action: "Action",
                Products: "Products",
                AboutUs: "About us",
                Imprint: "Imprint",
                DataPrivacy: "Data Privacy",
                Profile: "Profile",
                OrderList: "Order List",

                // Profile Info
                Email : "Email",
                InvoiceEmail : "Invoice Email Address",
                Password : "Password",
                CompanyName: "CompanyName (Firm)",
                CorporateForm: "Corporate Form",
                CorporateFormOHG: "OHG",
                CorporateFormEK: "e.K.",
                SirMr: "Mr",
                SirMrs: "Mrs",
                SirCode: "Anrede",
                SirTitle: "Title",
                FaxNumber: "Fax-No.",
                VatID: "VAT ID",
                TaxID: "Tax ID",
                FirstName: "First Name",
                LastName: "Last Name",
                PhoneNumber: "Tel.-No.",
                CompanyIdCode: "Company Id",
                PharmacyAddress: "Address",
                AddressStreet: "Street",
                AddressHouseNumber: "House Number",
                AddressZipCode: "Zip Code",
                AddressCity: "City",
                BusinessLicense: "Business License",
                OfficialDocument: "Official Document",

                // Validation
                InvalidEmailAddress: "Invalid email address",
                PasswordMin6Letters: "Password must be more than 6 characters",
                ThisFieldRequired: "This field is required",
                Require11Digits: "This field requires at least 11 digits.",
                DocumentFieldRequired: "Please upload required documents",
                PasswordNotMatch: "Password do not match",
                IsRequired: "is required",

                // Login
                SignOut: "Sign out",
                ForgotPassword: "Forgot password ?",
                NewCustomer: "New Customer ?",
                CreateAccount: "Create Account",

                // Forgot Password
                ResetPassword: "Reset Password",
                RememberPassword: "Back to",

                // Sign Up
                SignupProfileInformation: "Profile Information",
                SignupProfileInstructionText: "Please enter your profile information.",
                SignupUploadDocuments: "Upload license",
                SignupSubmission: "Submit", 
                SignupLicenseInstructionText: "Please upload your trade license and official business document.",            
                ReviewYourEntries: "Please check your information.",
                Name: "Name",
                Back: "Back",
                Next: "Next",
                FinishRegistration: "Finish registration",

                // License in Profile
                Submit: "Submit",
                UploadLicenseDocumentLabel: "License Document",
                UploadLicenseDocumentInstruction: "Please upload any missing license document for full-support activity.",

                // License
                Upload: "Upload",
                UploadLicenseLabel: "Upload document format: pdf, jpg, png (maximum size 10 MB)",
                UploadedSucessful: " Documents uploaded successfully.",

                // Check Email
                RegisterCheckEmailTitle: "Thank you for registering.",
                RegisterCheckEmailBody1: "We have sent a link to your email address for verification.",
                RegisterCheckEmailBody2Header: "Please",
                RegisterCheckEmailBody2: " check your mailbox.",

                // Thanks for Order
                ThanksOrderTitle: "Thank you for placing your order with German Capital Pharma GmbH",
                ThanksOrderID: "Order number: ",
                ThanksOrderBody1: "You will find an order confirmation as well as the corresponding invoice in your mailbox shortly.",
                ThanksOrderBody2: "Alternatively, you can download them directly in your personal profile.",
                ThanksOrderBody3: "If you have any queries or problems, please submit your request in writing by e-mail to service@gc-pharma.de.",
                ThanksOrderBody4: "With kind regards",
                ThanksOrderTeam: "Your German Capital Pharma GmbH Team",

                // Set Password
                SetPasswordLabel: "Set your new password.",
                ConfirmPassword : "Confirm Password",

                // Shop
                SortBy: "Sort by",
                ItemsPerPage: "Items Per Page",
                DefaultSorting: "Default Sorting",
                Latest: "Latest",
                Rating: "Rating",
                Sale: "Sale",
                Price: "Price",
                PriceNetto: "Net Price",
                PriceBrutto: "Gross Price",
                VAT: "VAT",
                PriceAsc: "Price: Low to High",
                PriceDesc: "Price: High to Low",
                ShoppingNow: "Shopping Now!",
                RemovedFromCart: "Item has been removed from the cart.",
                AccountNotApproved: "Your account is under review. You can place orders as soon as your account has been verified.",

                // Imprint
                ImprintCaptial: "German Capital Pharma GmbH",
                ImprintAddress: "Badstr. 20",
                ImprintPostCode: "13357 Berlin",
                ImprintVatIDNo: "VAT-ID: DE309937854",
                ImprintCommercialRegister: "Commercial Register: Berlin-Charlottenburg, HRB 183102B",
                ImprintManagingDirector: "Managing Director: Skender Berisha",

                // Product
                ShopNow: "SHOP NOW",
                UPTO70OFF: "UP TO 70% OFF",
                ViewDetails: "View Details",
                QuickViews: "Quick views",
                AddToCart: "Add to cart",
                AddedToCart: "The product has been added to cart!",
                NotFoundProduct: "Not found product",
                ClearAllFilter: "Clear all filter",
                LoginNow: "Login Now",
                NoProductFound: "No Product Found",
                ProductDescription: "Product Description",
                ProductNutrition: "Product Nutrition",
                ProductIngredients: "Product Ingredients",
                ProductConsumption: "Product Consumption",
                Quantity: "Quantity",
                SelectQuantity: "Select Quantity",
                // Checkout: "Checkout",

                //Cart
                YourCartIsEmpty: "Your cart is empty!",
                Total: "Total",
                CartTotal: "Cart Total",
                ViewShoppingCart: "View Shopping Cart",
                ProductImage: 'Product Images',
                Items: "Items",
                TotalPrice: "Total Price",
                TotalPriceNetto: "Total Price (Net)",
                TotalPriceBrutto: "Total Price (Gross)",
                ProceedToCheckout: "Process to checkout",
                ItemHasUpdated: "Item has been updated.",
                
                // Checkout
                Checkout: "Place Order",
                Tax: "Tax",
                OrderSummary: "Order Summary",
                Shipping: "Shipping",
                PaymentMethod: "Invoice",
                AccountPay: "AccountPay",
                PlaceOrderSuccess: "Thank you for your order",

                // Order
                OrderItems: "Ordered Items",
                OrderListHeaderID: "Order ID",
                OrderListHeaderDate: "Order Date",
                OrderListHeaderProduct: "Product",
                OrderListHeaderNetPrice: "Price (Net)",
                OrderListHeaderVAT: "VAT in %",
                OrderListHeaderQty: "Qty",
                OrderListHeaderSumPrice: "Sum (Net)",
                OrderListHeaderTax: "Tax",
                OrderListHeaderTotalPrice: "Sum (Gross)",
                OrderListHeaderStatus: "Status",
                OrderListHeaderInvoice: "Download Invoice",
                OrderListHeaderRebuy: "Re-buy",

                // Profile
                Cancel: "Cancel",
                Edit: "Edit",
                Save: "Save",
                Update: "Update",
                Open: "Open",
                Download: "Download",
                CancelUpdate: "Cancel Update",

                // Order Status
                Order_cancelled: "cancelled",
                Order_done: "done",
                Order_pending: "pending",
                Order_open: "open",

                // Header
                SignIn: "Sign in",
                SignUp: "Sign up",

                // Footer
                Copyright: "Copyright",
                AllRightReserved: "All Right Reserved.",
            }
          },
          de: {
            translation: {
                PharmacyStore: "Pharmacy Store",

                // Messages
                Welcome: "Herzlich willkommen bei German Capital Pharma GmbH",
                ThanksRegister: "Vielen Dank für Ihre Registrierung. Sie erhalten in Kürze eine E-Mail. Bitte überprüfen Sie Ihr Postfach.",
                PasswordSetSuccess: "Passwort erfolgreich gesetzt, Sie können sich jetzt anmelden.",
                PasswordResetSuccess: "Passwort zurücksetzen erfolgreich, bitte überprüfen Sie Ihre Mailbox.",
                ProfileUpdateSuccess: "Profil erfolgreich aktualisiert.",
                LicenseUploadSuccess: "Handelsregisterauszug erfolgreich hochgeladen.",
                AccountNotVerified: "Ihr Konto ist noch nicht verifiziert.",
                EditionBlocked: "Sie haben zweimal Änderungen in Ihrem Profil vorgenommen und können es nicht mehr aktualisieren.",
                PriceChanged: "Bitte beachten Sie, dass sich die Preise der Produkte ggf. geändert haben können.",

                // Pages
                Home: "Home",
                Shop: "Shop",
                Dashboard: "Dashboard",
                Cart: "Warenkorb",
                Action: "Aktion",
                Products: "Produkte",
                AboutUs: "Über uns",
                Imprint: "Impressum",
                DataPrivacy: "Datenschutzerklärung",
                Profile: "Profil",
                OrderList: "Bestellübersicht",

                // Profile Info
                Email : "E-Mail",
                InvoiceEmail : "Rechnungs-E-Mail-Adresse",
                Password : "Passwort",
                CompanyName: "Apothekenname (Firma)",
                CorporateForm: "Gesellschaftsform",
                CorporateFormOHG: "OHG",
                CorporateFormEK: "e.K.",
                SirCode: "Anrede",
                SirTitle: "Titel",
                SirMr: "Herr",
                SirMrs: "Frau",
                FaxNumber: "Fax-Nr.",
                VatID: "USt.-Nr.",
                TaxID: "Steuernummer",
                FirstName: "Vorname Ansprechpartner",
                LastName: "Nachname Ansprechpartner",
                PhoneNumber: "Tel.-Nr.",
                CompanyIdCode: "Institutskennzeichen",
                PharmacyAddress: "Apothekenanschrift",
                AddressStreet: "Straße",
                AddressHouseNumber: "Hausnummer",
                AddressZipCode: "PLZ",
                AddressCity: "Ort",
                BusinessLicense: "Betriebserlaubnis",
                OfficialDocument: "Handelsregisterauszug",

                // Validation
                InvalidEmailAddress: "Ungültige E-Mail Adresse",
                PasswordMin6Letters: "Passwort muss aus mindestens 6 Zeichen bestehen.",
                ThisFieldRequired: "Dieses Feld wird benötigt.",
                Require11Digits: "Die Steuernummer besteht aus 11 Ziffern.",
                DocumentFieldRequired: "Bitte laden Sie erforderliche Dokumente hoch.",
                PasswordNotMatch: "Passwort stimmt nicht überein.",
                IsRequired: "wird benötigt.",

                // Login
                SignOut: "Ausloggen",
                ForgotPassword: "Passwort vergessen ?",
                NewCustomer: "Neuer Kunde ?",
                CreateAccount: "Konto erstellen",

                // Forgot Password
                ResetPassword: "Passwort zurücksetzen",
                RememberPassword: "Zurück zu",

                // Sign Up
                SignupProfileInformation: "Profil Informationen",
                SignupProfileInstructionText: "Bitte geben Sie Ihre Profilinformationen ein.",
                SignupUploadDocuments: "Dokumente hochladen",
                SignupSubmission: "Übersicht",
                SignupLicenseInstructionText: "Bitte laden Sie erforderliche Dokumente hoch.",
                ReviewYourEntries: "Bitte überprüfen Sie Ihre Eingaben.",
                Name: "Ansprechpartner",
                Back: "Zurück",
                Next: "Weiter",
                FinishRegistration: "Registrierung abschließen",

                // Imprint
                ImprintCaptial: "German Capital Pharma GmbH",
                ImprintAddress: "Badstr. 20",
                ImprintPostCode: "13357 Berlin",
                ImprintVatIDNo: "USt.-ID-Nr(VAT-ID): DE309937854",
                ImprintCommercialRegister: "Handelsregister: Berlin-Charlottenburg, HRB 183102B",
                ImprintManagingDirector: "Geschäftsführer: Skender Berisha",

                // License in Profile
                Submit: "Einreichen",
                UploadLicenseDocumentLabel: "Dokumente hochladen",
                UploadLicenseDocumentInstruction: "Bitte laden Sie erforderliche Dokumente hoch.",

                // License
                Upload: "Hochladen",
                UploadLicenseLabel: "Unterstütze Dateiformate: pdf, jpg, png (maximale Dateigröße 10 MB)",
                UploadedSucessful: " Dokument erfolgreich hochgeladen.",

                // Check Email
                RegisterCheckEmailTitle: "Vielen Dank für die Registrierung.",
                RegisterCheckEmailBody1: "Zur Verifizierung haben wir einen Link an Ihre E-Mail Adresse gesendet.",
                RegisterCheckEmailBody2Header: "Bitte",
                RegisterCheckEmailBody2: " überprüfen Sie Ihr Postfach.",

                // Thanks for Order
                ThanksOrderTitle: "Vielen Dank für Ihre Bestellung bei der German Capital Pharma GmbH.",
                ThanksOrderID: "Bestellnummer: ",
                ThanksOrderBody1: "Eine Bestellbestätigung sowie zugehörige Rechnung finden Sie in Kürze in Ihrem Postfach.",
                ThanksOrderBody2: "Alternativ können Sie diese in Ihrem persönlichen Profil direkt herunterladen.",
                ThanksOrderBody3: "Bei Rückfragen oder Problemen reichen Sie Ihr Anliegen bitte schriftlich per E-Mail an service@gc-pharma.de ein.",
                ThanksOrderBody4: "Mit freundlichen Grüßen",
                ThanksOrderTeam: "Ihr German Capital Pharma GmbH Team",

                // Set Password
                SetPasswordLabel: "Legen Sie Ihr Passwort fest.",
                ConfirmPassword : "Passwort bestätigen",

                // Shop
                SortBy: "Sortieren",
                ItemsPerPage: "Artikel pro Seite",
                DefaultSorting: "Sortieren",
                Latest: "Neueste Produkte",
                Rating: "Bewertung",
                Sale: "Rabattaktion",
                Price: "Preis",
                PriceNetto: "Preis (Netto)",
                PriceBrutto: "Preis (Brutto)",
                VAT: "USt.",
                PriceAsc: "Preis aufsteigend",
                PriceDesc: "Preis absteigend",
                ShoppingNow: "Jetzt einkaufen!",
                RemovedFromCart: "Produkt wurde aus dem Warenkorb entfernt.",
                AccountNotApproved: "Ihr Konto wird derzeit überprüft. Nach erfolgreicher Prüfung Ihre Registrierungsanfrage können Sie Bestellungen bei uns aufgeben.",
////
                // Product
                ShopNow: "JETZT KAUFEN",
                UPTO70OFF: "bis zu 70% Rabatt!",
                ViewDetails: "Details anzeigen",
                QuickViews: "Quick views",
                AddToCart: "Zum Warenkorb hinzufügen",
                AddedToCart: "Produkt wurde zum Warenkorb hinzugefügt!",
                NotFoundProduct: "Produkt nicht gefunden",
                ClearAllFilter: "Alle Filter zurücksetzen",
                LoginNow: "Jetzt anmelden",
                NoProductFound: "Keine Produkte gefunden",
                ProductDescription: "Beschreibung",
                ProductNutrition: "Nährwerttabelle",
                ProductIngredients: "Zusammensetzung",
                ProductConsumption: "Verzehrempfehlung",
                Quantity: "Anzahl",
                SelectQuantity: "Anzahl auswählen",

                // Cart
                YourCartIsEmpty: "Ihr Warenkorb ist leer!",
                Total: "Gesamt",
                CartTotal: "Warenkorb gesamt",
                ViewShoppingCart: "Warenkorb anzeigen",
                ProductImage: 'Produktfoto',
                Items: "Artikel",
                TotalPrice: "Gesamtpreis",
                TotalPriceNetto: "Gesamtpreis (Netto)",
                TotalPriceBrutto: "Gesamtpreis (Brutto)",
                ProceedToCheckout: "Weiter zum Checkout",
                ItemHasUpdated: "Artikel wurde aktualisiert",

                // Checkout
                Checkout: "Bestellung aufgeben",
                Tax: "Umsatzsteuer",
                OrderSummary: "Bestellübersicht",
                Shipping: "Lieferanschrift",
                PaymentMethod: "Zahlungsmethode: Rechnung",
                AccountPay: "auf Rechnung",
                PlaceOrderSuccess: "Vielen Dank für Ihre Bestellung",
////

                // Order
                OrderItems: "Bestellartikel",
                OrderListHeaderID: "Bestellnummer",
                OrderListHeaderDate: "Bestelldatum",
                OrderListHeaderProduct: "Produkt",
                OrderListHeaderNetPrice: "Preis (Netto)",
                OrderListHeaderVAT: "Umsatzsteuer in %",
                OrderListHeaderQty: "Menge",
                OrderListHeaderSumPrice: "Gesamt (Netto)",
                OrderListHeaderTax: "Umsatzsteuer gesamt",
                OrderListHeaderTotalPrice: "Gesamt (Brutto)",
                OrderListHeaderStatus: "Bestellstatus",
                OrderListHeaderInvoice: "Rechnung",
                OrderListHeaderRebuy: "Erneut bestellen",

                // Profile
                Cancel: "Abbrechen",
                Edit: "Bearbeiten",
                Save: "Speichern",
                Update: "aktualisieren",
                Open: "Dokument öffnen",
                Download: "Herunterladen",
                CancelUpdate: "Update abbrechen",

                // Order Status
                Order_cancelled: "storniert",
                Order_done: "abgeschlossen",
                Order_pending: "Bearbeitung",
                Order_open: "offen",

                // Header
                SignIn: "Anmeldung",
                SignUp: "Registrierung",

                // Footer
                Copyright: "Urheberrecht",
                AllRightReserved: "Alle Rechte vorbehalten.",
            }
          }
      }
  });