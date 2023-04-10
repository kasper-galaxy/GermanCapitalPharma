import { RaRecord, Identifier } from 'react-admin';

export type ThemeName = 'light' | 'dark';

export interface User extends RaRecord {
    companyName: string,
    corporationForm: string,
    email: string,
    invoiceEmail: string,
    nameSirCode: string,
    nameSirTitle: string,
    nameFirst: string,
    nameLast: string,
    addressStreet: string,
    addressHouse: string,
    addressZipCode: string,
    addressCity: string,
    phoneNumber: string,
    faxNumber: string,
    vatIdCode: string,
    taxIdCode: string,
    companyIdCode: string,
    businessLicense: {
        url: string,
        title: string
    },
    officialDocument: {
        url: string,
        title: string
    },
    additionalDocument: string[],
    businessLicenseState: string,
    officialDocumentState: string,
    emailConfirmed: boolean,
    userProxy: boolean,
    userVerified: boolean,
    editionBlocked: boolean,
    userFreezed: boolean,
    wrongPasswordCount: number,
    editionCount: number,
    createdAt: Date,
    updatedAt: Date,
    lastSeen: Date,
    totalOrders: number,
    totalSpent: number,
    password: string,
}

export interface Product extends RaRecord {
    name: string,
    price: number,
    vat: number,
    images: ProductImage[],
    description: string,
    itemNumber: string,
    ingredients: {
        columns: IngredientColumn[],
        data: []
    },
    consumption: string,
    totalSold: number,
}

export interface Order extends RaRecord {
    user: Identifier,
    orderItems: OrderItem[],
    companyName: string,
    deliveryAddress: string,
    totalPrice: number,
    netPrice: number,
    taxPrice: number,
    source: string,
    status: string,
    invoice: string,
    deliveryStatus: string,
    paymentStatus: string,
    receivedPaymentAt: Date,
    expectedPaymentAt: Date,
    createdAt: Date,
    updatedAt: Date,
    cancelled: Boolean
}

export interface Invoice extends RaRecord {
    user: Identifier,
    order: Identifier,
    orderItems: OrderItem[],
    address: string,
    totalPrice: number,
    netPrice: number,
    taxPrice: number,
    createdAt: Date,
    updatedAt: Date,
    url: string
}

export interface OrderItem {
    product: Identifier,
    name: string,
    price: number,
    qty: number,
    vat: number,
}

export interface ProductImage {
    url: string;
}
export interface IngredientColumn {
    id: string;
    label: string;
}
export interface IngredientData {
    url: string;
}

declare global {
    interface Window {
        restServer: any;
    }
}
