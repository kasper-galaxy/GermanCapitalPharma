import { logout } from "./actions/user.action";

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR'
})

const taxFormatter = new Intl.NumberFormat('de-DE', {
  style: 'percent'
})

const nameFormatter = (user, t) => {
  if (!user) {
    return '';
  }  
  return user.nameSirCode === 'Mr' ? t('SirMr') : t('SirMrs') + ' ' + (user.nameSirTitle && user.nameSirTitle.length > 0 ? user.nameSirTitle + '. ' : '')  + user.nameFirst + ' ' + user.nameLast
}

const errorHandler = (dispatch, error, type) => {
  if (error.response) {
      // Request made and server responded
      console.log('ERROR : ', type);
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      if (error.response.status === 401) {
          dispatch(logout());
      }
  } else if (error.request) {
      // The request was made but no response was received
      console.log('The request was made but no response was received : ', error.request);
  } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Something happened in setting up the request that triggered an Error', error.message);
  }

  dispatch({
      type,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
};

function getFormDataFromObject(object) {
  const formData = new FormData();
  Object.keys(object).forEach(key => {
      if (typeof object[key] !== 'object') formData.append(key, object[key])
      else formData.append(key, JSON.stringify(object[key]))
  })
  return formData;
}

function calcTaxPerVAT(obj) {
  var holder = {};

  obj.forEach(function(d) {
  if (holder.hasOwnProperty(d.vat)) {
      holder[d.vat] = holder[d.vat] + d.price * d.qty * d.vat;
  } else {
      holder[d.vat] = d.price * d.qty * d.vat;
  }
  });

  var obj2 = [];

  for (var prop in holder) {
      obj2.push({ vat: prop, sum: holder[prop] });
  }
  obj2.sort((obj, nxt) => obj.vat - nxt.vat);
  return obj2;
}

const formatDate = (date, join = '-') => {
  if (!date) return '';
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  if (join === '.') {
    return `${day}.${month}.${year}`
  }
  return [year, month, day].join(join);
};

export {
  currencyFormatter,
  taxFormatter,
  nameFormatter,
  errorHandler,
  getFormDataFromObject,
  calcTaxPerVAT,
  formatDate
};