import { createTransport, SendMailOptions } from 'nodemailer';

const transporter = createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'jordan.block59@ethereal.email',
    pass: 'Y2bkbsakXvGsDpTJjR'
  }
})

export const sendVerifyUserEmail = async(recipient: string, token: string) => {
  let options: SendMailOptions = {
    from: 'matthewmorton@protonmail.com',
    to: recipient,
    subject: 'Please verify your account!',
    html: `Thanks for signing up. <a target=_blank href=${process.env.API_HOST}/auth/verify-user?token=${token}>Verify your account now!</a>`
  };
  try {
    await transporter.sendMail(options);
  } catch (e) {
    console.log(e);
  }
}

export const sendVerifyAdminUserEmail = async(recipient: string, token: string) => {
  let options: SendMailOptions = {
    from: 'matthewmorton@protonmail.com',
    to: recipient,
    subject: 'Admin User Authorization',
    html: `Please click the link to change your role to an administrator. <a target=_blank href=${process.env.API_HOST}/auth/verify-user?token=${token}>Confirm</a>`
  };
  try {
    await transporter.sendMail(options);
  } catch (e) {
    console.log(e);
  }
}

export const sendWelcomeEmail = async(recipient: string) => {
  let options: SendMailOptions = {
    from: 'matthewmorton@protonmail.com',
    to: recipient,
    subject: 'Welcome!',
    html: '<b>This is a welcome email</b>'
  };
  try {
    await transporter.sendMail(options);
  } catch (e) {
    console.log(e);
  }
}

export const sendFarewellEmail = async(recipient: string) => {
  let options: SendMailOptions = {
    from: 'matthewmorton@protonmail.com',
    to: recipient,
    subject: 'Sorry to see you go!',
    html: '<b>This is a farewell email</b>'
  };
  try {
    await transporter.sendMail(options);
  } catch (e) {
    console.log(e);
  }
}

export const sendVerifyAlternativeEmail = async(recipient: string, update_email_token: string) => {
  let options: SendMailOptions = {
    from: 'matthewmorton@protonmail.com',
    to: recipient,
    subject: 'So you want to change your login email...',
    html: `<b>Please click the link below to verify this email account</b>
          <a ${process.env.API_HOST}/auth/update-email/${update_email_token}>Verify now!</a>`
  };
  try {
    await transporter.sendMail(options);
  } catch (e) {
    console.log(e);
  }
}
