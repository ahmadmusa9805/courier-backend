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

   console.log('email=======musa', email);
   console.log('otp=======musa', otp);

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

