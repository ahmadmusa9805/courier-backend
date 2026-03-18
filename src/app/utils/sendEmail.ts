/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import config from '../config';
// import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export class SendEmail {
  private static transporter = nodemailer.createTransport({
    service: 'gmail', // Or use another email service
    auth: {
      pass: config.email_app_password, // Your email password
      user: config.admin_email_user, // Your email
    },
    tls: {
    rejectUnauthorized: false, // <-- allows self-signed certs
  },
  });

  static async sendOTPEmail(email: string, otp: string): Promise<void> {

    const mailOptions = {
      // from: process.env.EMAIL_USER, // Sender email address
      from: config.admin_email_user, // Sender email address
      to: email, // Recipient email
      subject: 'Your OTP for Verification',
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`OTP sent to ${email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send OTP email.');
    }
  }
  static async sendInvoiceEmail(email: string, payload: any): Promise<void> {    

const html = `
<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: auto;">

  <!-- Header with centered logo -->
  <div style="text-align: center; margin-bottom: 80px;">
    <img src="https://courier-bucket-graham.s3.eu-central-1.amazonaws.com/logo.svg" width="120" alt="Koerierplatform Logo"/>
  </div>

  <!-- Top Row: User Info + Invoice Dates (Left) | Company Info (Right) -->
  <div style="display: flex; justify-content: space-between; margin-top: 20px;">

    <!-- LEFT: User Info + Invoice Dates -->
    <div style="flex: 1; margin-right: 10px;">
      <p style="margin:0;">
        <strong>Factuur aan:</strong><br/>
        ${payload.userName}<br/>
        ${payload.userAddress}<br/>
        ${payload.country || ''}<br/>
        ${payload.kvkNumber ? `KvK nr: ${payload.kvkNumber}<br/>` : ''}
        ${payload.btwNumber ? `BTW nr: ${payload.btwNumber}<br/>` : ''}
      </p>
      <p style="margin-top: 10px;">
        <strong>Factuurdatum:</strong> ${payload.invoiceDate}<br/>
        <strong>Factuurnummer:</strong> ${payload.invoiceNumber}<br/>
        <strong>Leverdatum:</strong> ${payload.deliveryDate}
      </p>
    </div>

    <!-- RIGHT: Company Info -->
    <div style="flex: 1; text-align: right; margin-left: 400px;">
      <p style="margin:0;">
        <strong>Koerierplatform</strong><br/>
        Telefoonstraat 5<br/>
        4702PH Roosendaal<br/>
        NL<br/>
        KvK nr: 92037798<br/>
        IBAN: NL73 INGB 0106 5552 43<br/>
        BIC: INGBNL2A<br/>
        BTW nr: NL0049.32.489.B13
      </p>
    </div>

  </div>

  <!-- Invoice Table -->
  <table width="100%" border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; margin-top: 20px;">
    <thead style="background-color: #f2f2f2;">
      <tr>
        <th>ID</th>
        <th>Beschrijving</th>
        <th>Excl. BTW</th>
        <th>Incl. BTW</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${payload.id}</td>
        <td>${payload.description}</td>
        <td>€ ${payload.priceExc.toFixed(2)}</td>
        <td>€ ${payload.priceInc.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

  <!-- Totals Right-Aligned with margin below -->
  <div style="text-align: right; margin-top: 15px; margin-bottom: 15px;">
    <p style="margin: 2px 0;"><strong>BTW (21%):</strong> € ${payload.btw.toFixed(2)}</p>
    <p style="margin: 2px 0;"><strong>Totaal Excl. BTW:</strong> € ${payload.priceExc.toFixed(2)}</p>
    <p style="margin: 2px 0;"><strong>Totaal Incl. BTW:</strong> € ${payload.priceInc.toFixed(2)}</p>
  </div>
  
  <br/>
  <br/>
  <br/>
  <br/>

  <hr/>

  <!-- Footer Note -->
  <p style="font-size: 14px; color: #555; margin-top: 10px;">
    Bedankt voor uw aanvraag. Uw opdracht is succesvol ontvangen en wordt uitgevoerd op de geplande datum.
  </p>

</div>
`;

    const mailOptions = {
      // from: process.env.EMAIL_USER, // Sender email address
      from: config.admin_email_user, // Sender email address
      to: email, // Recipient email
      subject: `Factuur ${payload.invoiceNumber} - Bevestiging`,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`invoice sent to ${email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send invoice email.');
    }
  }

 static async sendEmailToAdmin(payload: any): Promise<void> {
    const { name, email, message } = payload;

  const mailOptions = {
    from: email,
    to: config.admin_email_user,
    subject: `New Message For Support from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `
  };

    console.log("testing", mailOptions)

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email have come from ${payload.email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to come email.');
    }
  }
}

