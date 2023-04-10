import { SENDGRID_MAIL, SERVICE_MAIL, TEAM_NAME } from "../config/constant.js";
import { generateCheckEmailToken, generateForgotPasswordToken, generateProxyPasswordToken } from "./generateToken.js";
import sendinblue from "./sendinblue.js";
import sendgrid from "./sendgrid.js";
import i18n from "../config/i18n.js";

const sendCheckEmailOneTimeLink = ({ email, origin }) => {
    const token = generateCheckEmailToken({ email });
    const checkEmailURL = `${origin}/set-password/token=${token}`;
    console.log('check email url: ', email, checkEmailURL);
    const message = `<h4>${i18n.__('CheckEmailTitle')}</h4>
                    <p>${i18n.__('ThankRegistering')}</p><br />
                    <p>${i18n.__('WelcomeToTeam', TEAM_NAME)}</p>
                    <p>${i18n.__('CheckEmailSection1')}</p>
                    <p><a href="${checkEmailURL}">
                        <button style="
                            background-color: #008CBA;
                            border: none;
                            color: white;
                            padding: 15px 32px;
                            text-align: center;
                            text-decoration: none;
                            display: inline-block;
                            font-size: 16px;
                            margin: 4px 2px;
                            cursor: pointer;">
                            
                            ${i18n.__('Confirm')}
                        
                            </button>
                    </a></p>
                    <p>${i18n.__('CheckEmailSection2')}</p>
                    <p>${i18n.__('CheckEmailSection3', SERVICE_MAIL)}</p>
                    <br />
                    <p>${i18n.__('FromTeam', TEAM_NAME)}</p>`;

    sendgrid({
        to: email,
        from: SENDGRID_MAIL,
        subject: i18n.__('CheckEmailLinkSubject', TEAM_NAME),
        text: 'and easy to do anywhere, even with Node.js',
        html: message,
    });
};

const sendForgotPasswordOneTimeLink = ({ email, origin }) => {
    const token = generateForgotPasswordToken({ email });
    const checkEmailURL = `${origin}/set-password/token=${token}`;
    console.log('forgot password url: ', checkEmailURL, email);
    const message = `<h4>${i18n.__('ForgotPasswordTitle')}</h4>
                    <p>${i18n.__('ForgotPasswordSection1')}</p>
                    <p>${i18n.__('ForgotPasswordSection2')}</p>
                    <p><a href="${checkEmailURL}">
                        <button style="
                            background-color: #008CBA;
                            border: none;
                            color: white;
                            padding: 15px 32px;
                            text-align: center;
                            text-decoration: none;
                            display: inline-block;
                            font-size: 16px;
                            margin: 4px 2px;
                            cursor: pointer;">
                            
                            ${i18n.__('Confirm')}
                        
                            </button>
                    </a></p>
                    <p>${i18n.__('ForgotPasswordSection3')}</p>
                    <p>${i18n.__('ForgotPasswordSection4', SERVICE_MAIL)}</p>
                    <p>${i18n.__('ForgotPasswordSection5')}</p>
                    <br />
                    <p>${i18n.__('FromTeam', TEAM_NAME)}</p>`;
    sendgrid({
        to: email,
        from: SENDGRID_MAIL,
        subject: i18n.__('CheckEmailLinkSubject', TEAM_NAME),
        text: 'and easy to do anywhere, even with Node.js',
        html: message,
    });
};

const sendProxyUserOneTimeLink = ({ email, password, origin }) => {
    const loginURL = `${origin}/login`;
    console.log('check email url: ', email, password, loginURL);
    const message = `<h4>${i18n.__('ReceiveAccountTitle')}</h4>
                    <p>${i18n.__('ReceiveAccountSection1')}</p>
                    <p>${i18n.__('ReceiveAccountSection2')}</p>
                    <p>${i18n.__('ReceiveAccountSection3', password)}</p>
                    <p><a href="${loginURL}">
                        <button style="
                            background-color: #008CBA;
                            border: none;
                            color: white;
                            padding: 15px 32px;
                            text-align: center;
                            text-decoration: none;
                            display: inline-block;
                            font-size: 16px;
                            margin: 4px 2px;
                            cursor: pointer;">
                            
                            ${i18n.__('Login')}
                        
                            </button>
                    </a></p>
                    <p>${i18n.__('ReceiveAccountSection4', SERVICE_MAIL)}</p>
                    <p>${i18n.__('ReceiveAccountSection5')}</p>
                    <br />
                    <p>${i18n.__('FromTeam', TEAM_NAME)}</p>`;
    sendgrid({
        to: email,
        from: SENDGRID_MAIL,
        subject: i18n.__('CheckEmailLinkSubject', TEAM_NAME),
        text: 'and easy to do anywhere, even with Node.js',
        html: message,
    });
};

const sendLicenseRejectMail = ({ email, origin, isBusiness }) => {
    const loginURL = `${origin}/login`;
    const subject = isBusiness ? 'LicenseRejectSubject_Business' : 'LicenseRejectSubject_Official';
    const title = isBusiness ? 'LicenseRejectSection1_Business' : 'LicenseRejectSection1_Official';
    console.log('check email url: ', email, loginURL, subject, title);
    const message = `<h4>${i18n.__(subject)}</h4>
                    <p>${i18n.__(title)}</p>
                    <p>${i18n.__('LicenseRejectSection2')}</p>
                    <p>${i18n.__('LicenseRejectSection3')}</p>
                    <p>${i18n.__('LicenseRejectSection4')}</p><br/>
                    <p>
                        ${i18n.__('LicenseRejectButtonText1')}
                        <a href="${loginURL}">${i18n.__('Here')}</a>
                            ${i18n.__('LicenseRejectButtonText2')}
                    </p>
                    
                    <p>${i18n.__('LicenseRejectSection6', SERVICE_MAIL)}</p>
                    <p>${i18n.__('LicenseRejectSection7')}</p></br>
                    <br />
                    <p>${i18n.__('FromTeam', TEAM_NAME)}</p>`;
    sendgrid({
        to: email,
        from: SENDGRID_MAIL,
        subject: TEAM_NAME,
        text: 'and easy to do anywhere, even with Node.js',
        html: message,
    });
};

const sendLicenseApproveMail = ({ email, origin }) => {
    const loginURL = `${origin}/login`;
    console.log('check email url: ', email, loginURL);
    const message = `<h4>${i18n.__('LicenseApproveSubject')}</h4>
                    <p>${i18n.__('LicenseApproveSection1')}</p>
                    <p>
                        <a href="${loginURL}">
                        <button style="
                            background-color: #008CBA;
                            border: none;
                            color: white;
                            padding: 15px 32px;
                            text-align: center;
                            text-decoration: none;
                            display: inline-block;
                            font-size: 16px;
                            margin: 4px 2px;
                            cursor: pointer;">
                            
                            ${i18n.__('Login')}
                            </button></a>
                    </p>`;
    sendgrid({
        to: email,
        from: SENDGRID_MAIL,
        subject: i18n.__('LicenseApproveSubject', TEAM_NAME),
        text: 'and easy to do anywhere, even with Node.js',
        html: message,
    });
};

const sendInvoiceNotifyEmail = ({ email, id }) => {
    console.log('invoice notify email : ', email);
    const message = `<h4>${i18n.__('InvoiceNotifySubject', TEAM_NAME)}</h4>
                    <p>${i18n.__('InvoiceNotifySection1', id)}</p>
                    <p>${i18n.__('InvoiceNotifySection2')}</p>
                    <p>${i18n.__('InvoiceNotifySection3')}</p>
                    <p>${i18n.__('InvoiceNotifySection4')}</p>
                    <p>${i18n.__('InvoiceNotifySection5', SERVICE_MAIL)}</p>
                    <p>${i18n.__('InvoiceNotifySection6')}</p>`;
    sendgrid({
        to: email,
        from: SENDGRID_MAIL,
        subject: i18n.__('InvoiceNotifySubject', TEAM_NAME),
        text: 'and easy to do anywhere, even with Node.js',
        html: message
    });
};

const sendInvoiceEmail = ({ email, attachment, id }) => {
    console.log('invoice email : ', email);
    const message = `<h4>${i18n.__('InvoiceSubject', TEAM_NAME)}</h4>
                    <p>${i18n.__('InvoiceSection1', id)}</p>
                    <p>${i18n.__('InvoiceSection2')}</p>
                    <p>${i18n.__('InvoiceSection3')}</p>
                    <p>${i18n.__('InvoiceSection4')}</p>
                    <p>${i18n.__('InvoiceSection5', SERVICE_MAIL)}</p>
                    <p>${i18n.__('InvoiceSection6')}</p>`;
    sendgrid({
        to: email,
        from: SENDGRID_MAIL,
        subject: i18n.__('InvoiceSubject', TEAM_NAME),
        text: 'and easy to do anywhere, even with Node.js',
        html: message,
        attachments: [
            {
                filename: `Rechnung_GC-Pharma-GmbH_${id}.pdf`,
                content: attachment,
                type: 'application/pdf',
                disposition: 'attachment'   
            }
        ]
    });
};

export {
    sendCheckEmailOneTimeLink,
    sendForgotPasswordOneTimeLink,
    sendProxyUserOneTimeLink,
    sendLicenseRejectMail,
    sendLicenseApproveMail,
    sendInvoiceEmail,
    sendInvoiceNotifyEmail
}