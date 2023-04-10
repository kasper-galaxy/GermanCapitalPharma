import { SENDINBLUE_MAIL, SERVICE_MAIL, TEAM_NAME } from "../config/constant.js";
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

    sendinblue({
        to: [{
            email,
        }],
        subject: i18n.__('CheckEmailLinkSubject', TEAM_NAME),
        sender: { email: SENDINBLUE_MAIL, name: TEAM_NAME },
        htmlContent: message,
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

                    sendinblue({
        to: [{
            email,
        }],
        subject: i18n.__('ForgotPasswordSectionSubject', TEAM_NAME),
        sender: { email: SENDINBLUE_MAIL, name: TEAM_NAME },
        htmlContent: message,
    });
};

const sendProxyUserOneTimeLink = ({ email, password, origin }) => {
    const loginURL = `${origin}/login`;
    console.log('check email url: ', email, password, loginURL);
    const message = `<h4>${i18n.__('ReceiveAccountTitle')}</h4>
                    <p>${i18n.__('WelcomeToTeam', TEAM_NAME)}</p>
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

    sendinblue({
        to: [{
            email,
        }],
        subject: i18n.__('CheckEmailLinkSubject', TEAM_NAME),
        sender: { email: SENDINBLUE_MAIL, name: TEAM_NAME },
        htmlContent: message,
    });
};

export {
    sendCheckEmailOneTimeLink,
    sendForgotPasswordOneTimeLink,
    sendProxyUserOneTimeLink
}