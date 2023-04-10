import { TranslationMessages } from 'react-admin';
import englishMessages from 'ra-language-english';

const customEnglishMessages: TranslationMessages = {
    ...englishMessages,
    pos: {
        search: 'Search',
        configuration: 'Configuration',
        language: 'Language',
        theme: {
            name: 'Theme',
            light: 'Light',
            dark: 'Dark',
        },
        dashboard: {
            monthly_revenue: 'Monthly Revenue',
            month_history: '30 Day Revenue History',
            new_orders: 'New Orders',
            pending_reviews: 'Pending Reviews',
            all_reviews: 'See all reviews',
            all_products: 'All Products',
            new_customers: 'New Customers',
            new_products: 'New Products',
            revenue_by_products: 'Revenue By Products',
            revenue_by_month: 'Revenue By Month',
            revenue_by_calendarweeks: 'Revenue By CalendarWeeks',
            all_customers: 'See all customers',
            pending_orders: 'Pending Orders',
            option_date: 'Date',
            option_week: 'Calendar Week',
            label_week: 'Week',
            label_nodata: 'No Data',
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
            orders: 'Orders',
            products: 'Products',
            users: 'Users',
        },
        bulk: {
            delete: {
                title: "Delete Users",
                content: "Are you sure?"
            }
        }
    },
    resources: {
        users: {
            name: 'Users',
            actions: {
                download_license_zip: 'Download License',
                send_mail_check_email: 'Send Signup Mail',
                send_mail_proxy_password_email: 'Send Temporary Password mail',
                verify: 'Verify User',
                cancel_verify: 'Cancel Verify User',
                license_approve: 'Approve',
                license_reject: 'Reject',
                cancel: 'Cancel',
                document_open: 'Open Document',
            },
            fields: {
                email: 'Email',
                invoice_email: 'Invoice Email',
                name: 'Name',
                name_sir_code: 'Sir Code',
                name_sir_title: 'Sir Title',
                name_first: 'First Name',
                name_last: 'Last Name',
                address: 'Address',
                address_street: 'Street',
                address_house: 'House',
                address_zipcode: 'Zip Code',
                address_city: 'City',
                company_name: 'Company Name',
                corporation_form: 'Corporation Form',
                company_id_code: 'Company ID',
                phone_number: 'Phone',
                fax_number: 'Fax',
                vat_id_code: 'Vat ID',
                tax_id_code: 'Tax ID',
                business_license: 'Business License',
                business_license_required: 'Business License (Required)',
                official_document: 'Official Document',
                additional_document: 'Additional Document',
                license_state: 'Business License / Official Document',
                business_license_state: 'Business License State',
                official_document_state: 'Official Document State',
                email_confirmed: 'Email Confirmed?',
                user_verified: 'Verified?',
                edition_blocked: 'Edition Blocked?',
                user_freezed: 'Freezed?',
                user_proxy: 'Temporary?',
                wrong_password_count: 'x Wrong Password',
                edition_count: 'x Edited',
                created_at: 'Created At',
                updated_at: 'Updated At',
                first_seen: 'First Seen',
                last_seen: 'Last Seen',
                is_admin: 'Is Admin',
                password: 'Password',
                confirm_password: 'Confirm Password',
                total_orders: 'Total Orders',
                total_spent: 'Total Spent'
            },
            field_groups: {
                profile: 'Profile',
                identity: 'Identity',
                address: 'Address',
                set_password: 'Set Password',
                company: 'Company',
                state: 'State',
                license: 'License',
                other: 'Other',
                action: 'Action',
            },
            constants: {
                select_fields: {
                    corporation_form: {
                        ohg: 'OHG',
                        ek: 'e.K.'
                    },
                    name_sir_code: {
                        mr: 'Mr',
                        mrs: 'Mrs'
                    },
                    license_status: {
                        not_uploaded: "Not Uploaded",
                        uploaded: "Uploaded",
                        rejected: "Rejected",
                        approved: "Approved",
                    }
                }
            },
            errors: {
                create_user_error: 'Could not create user',
                update_user_error: 'Could not update user',
                no_approval_without_email_confirmation: 'Could not approve license without email confirmation',
                no_business_license_state: 'No Business License State',
                no_official_document_state: 'No Official Document State',
                password_mismatch: 'The password does not match.',
                no_business_license: 'No business license file!',
                action_without_license: 'Cannot perform action without uploading file',
                zipcode_not_valid: 'Zipcode invalid',
                tax_id_code_not_valid: 'Invalid Tax ID',
                tax_id_code_not_min: 'Tax ID must contain at least 11 digits',
                phone_number_not_valid: 'Invalid phone number'
            },
            messages: {
                send_mail_success: 'Email Sent!',
                send_mail_failed: 'Email Not Sent. Try again later',
                operation_success: 'Operation successed!',
                operation_failed: 'Operation failed'
            },
            filters: {
                last_visited: 'Last visited',
                today: 'Today',
                this_week: 'This week',
                last_week: 'Last week',
                this_month: 'This month',
                last_month: 'Last month',
                earlier: 'Earlier',
                has_ordered: 'Has ordered',
                is_verified: 'Is verified',
                is_freezed: 'Is freezed',
                clear_filter: 'Clear filter'
            }
        },
        products: {
            name: 'Products',
            actions: {
            },
            fields: {
                name: 'Name',
                value_added_tax: 'VAT',
                price_net: 'Price (Net)',
                item_number: 'Item Number',
                description: 'Description',
                images: 'Images',
                ingredients: 'Ingredients',
                consumption: 'Consumption',
                created_at: 'Created At',
                updated_at: 'Updated At',
                upload_product_images: 'Upload Product Images'
            },
            field_groups: {
                product_description: 'Product Description',
                product_ingredients: 'Product Ingredients',
                product_consumption: 'Product Consumption',
                product_images: 'Product Images',
                product_item_number: 'Item Number',
            },
            constants: {},
            errors: {},
            messages: {},
            filters: {},
            sortby: {
                name: 'Sort by'
            }
        },
        orders: {
            name: 'Order Summary',
            title: 'Order Summary %{reference}',
            status: {
                open: 'Open',
                pending: 'Pending',
                done: 'Done',
                cancelled: 'Cancelled',
                delivered: 'Delivered',
            },
            constants: {
                status: {
                    open: 'Open',
                    done: 'Done',
                    sent: 'Sent',
                    paid: 'Paid',
                    cancelled: 'Cancelled',
                    not_paid: 'Not paid',
                    pending: 'In progress',
                }
            },
            actions: {
                return: 'Return Order',
                cancel_return: 'Cancel Return',
                open: "Open"
            },
            fields: {
                id: 'ID',
                user: 'Customer',
                order_items: 'Ordred Items',
                pharmacy_name: 'Pharmacy',
                delivery_address: 'Delivery Address',
                total_price: 'Total Price',
                tax_price: 'Tax',
                source: 'Channel',
                status: 'Status',
                date_gte: 'Date Gte',
                date_lte: 'Date Lte',
                delivery_status: 'Delivery Status',
                payment_status: 'Payment Status',
                received_payment_at: 'Received Payment At',
                expected_payment_at: 'Expected Payment At',
                cancelled: 'Cancelled',
                invoice: 'Invoice',
                created_at: 'Orderd At',
                updated_at: 'Edited At',
                order_item: {
                    product: 'Product',
                    name: 'Name',
                    price: 'Price',
                    qty: 'Qty',
                    vat: 'VAT'
                },
                basket: {
                    delivery: 'Delivery',
                    reference: 'Reference',
                    quantity: 'Quantity',
                    sum: 'Sum',
                    tax_rate: 'Tax Rate',
                    taxes: 'VAT (%{vat})',
                    total: 'Total',
                    unit_price: 'Unit Price',
                }
            },
            section: {
                order: 'Order Summary',
                customer: 'Customer',
                pharmacy: 'Pharmacy',
                delivery_address: 'Delivery Address',
                items: 'Items',
                payment: 'Payment',
                total: 'Totals',
            },
            field_groups: {},
            errors: {},
            messages: {},
            filters: {},
            sortby: {
                name: 'Sort by',
            }
        },
        invoices: {
            name: 'Invoices',
            title: 'Invoice %{reference}',
            fields: {
                id: 'ID',
                user: 'Customer',
                order: 'Order',
                order_items: 'Ordred Items',
                delivery_address: 'Delivery Address',
                total_price: 'Total Price',
                tax_price: 'Tax',
                url: 'PDF',
                created_at: 'Orderd At',
                updated_at: 'Edited At',
                date_gte: 'From',
                date_lte: 'Until',
                order_item: {
                    product: 'Product',
                    name: 'Name',
                    price: 'Price',
                    qty: 'Qty',
                    vat: 'VAT'
                },
                basket: {
                    delivery: 'Delivery',
                    reference: 'Reference',
                    quantity: 'Quantity',
                    sum: 'Sum',
                    tax_rate: 'Tax Rate',
                    taxes: 'VAT (%{vat})',
                    total: 'Total',
                    unit_price: 'Unit Price',
                }
            },
            actions: {
                download_invoice_zip: 'Download Invoice',
                open: "Open"
            },
        },
        notifications : {
            name: 'Notifications',
            title: 'Notifications %{reference}',
            fields : {
                description: 'Description',
                user: 'User',
                createdAt: 'Created Time'
            },
            alarm : {
                newUserCreated : 'New User Created.',
                newOrderCreated : 'New Order Created.',
                UserUpdated : 'User Updated.'
            }
        }
    },
};

export default customEnglishMessages;
