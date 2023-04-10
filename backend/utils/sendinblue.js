import pkg from 'sib-api-v3-sdk';
const { ApiClient } = pkg;
const defaultClient = ApiClient.instance;

// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';
// apiKey.apiKey = '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';

var apiInstance = new pkg.TransactionalEmailsApi();

const sendinblue = (sendSmtpEmail) => {
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
    console.log('success ', sendSmtpEmail, data);
      return true;
    }, function(error) {
      console.error('sendinblue error ', error);
      return false;
    });
}

export default sendinblue;