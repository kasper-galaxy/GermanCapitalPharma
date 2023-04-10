import i18n from "../config/i18n.js";
import fs from 'fs';
import { MODEL_TYPE_ORDER, MODEL_USER, MODEL_PRODUCT, MODEL_INVOICE, SOURCE_ADMIN } from "../config/constant.js";

export const isObject = (val) => {
    return val instanceof Object; 
};

export const errorMessageGenerator = (msgCode) => {
    return i18n.__(msgCode);
};

export const genRand = (len) => {
    return Math.random().toString(36).substring(2,len+2);
};

export const formatAddress = (address) => {
    return address.street + ' ' + address.house + ', ' + address.zipcode + ' ' + address.city;
};

export const currencyFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
});
  
export const taxFormatter = new Intl.NumberFormat('de-DE', {
    style: 'percent'
});

export const calcTaxPerVAT = (obj) => {
    var holder = {}; 
    var base = {};

    obj.forEach(function(d) {
    if (holder.hasOwnProperty(d.vat)) {
        holder[d.vat] = holder[d.vat] + d.price * d.qty * d.vat;
        base[d.vat] = base[d.vat] + d.price * d.qty;
    } else {
        holder[d.vat] = d.price * d.qty * d.vat;
        base[d.vat] = d.price * d.qty;
    }
    });

    var obj2 = [];

    for (var prop in holder) {
        obj2.push({ vat: prop, sum: holder[prop], base: base[prop] });
    }
    obj2.sort((obj, nxt) => obj.vat - nxt.vat);
    return obj2;
};

export const formatDate = (date, join='-') => {
    if (!date)  return '';
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    if (join === '.') {
        return [day, month, year].join(join);
    }
    return [year, month, day].join(join);
};

export const readFile = (filePath) => {
    console.log(filePath);
    let exists = fs.existsSync(filePath);
    if(exists){
        let data = fs.readFileSync(filePath);
        return data;
    }
    return null;
};

export const generateID = (model, source, counter) => { 
    let id = '';
    let leading_zero = 5;
    // Suffix
    switch (model) {
        case MODEL_USER:
            id = source + 'C';
            break;
        case MODEL_TYPE_ORDER:
            id = source + 'B';
            break;
        case MODEL_PRODUCT:
            id = 'P';
            break;
        case MODEL_INVOICE:
        default:
            break;
    }
    // Prefix
    let prefix = String(counter).padStart(5, '0');
    id += prefix;
    return id;
};