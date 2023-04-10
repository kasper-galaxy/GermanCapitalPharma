import sgMail from '@sendgrid/mail';
sgMail.setApiKey('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');

const sendgrid = (sendSmtpEmail) => {
    console.log('smtp ', sendSmtpEmail);
    sgMail.send(sendSmtpEmail)
        .then((msg) => {
            console.log('success ', msg)
        })
        .catch((error) => {
            console.error(error.response.body);
        });
  }
  
  export default sendgrid;