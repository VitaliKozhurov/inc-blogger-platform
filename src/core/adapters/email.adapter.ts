import nodemailer from 'nodemailer';

import { SETTINGS } from '../../core/settings';

type SendEmailArgs = { email: string; html: string; from?: string; subject?: string };

export const emailAdapter = {
  createTransport() {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SETTINGS.APP_EMAIL_ADDRESS,
        pass: SETTINGS.APP_EMAIL_PASSWORD,
      },
    });

    return transport;
  },
  async sendEmail({
    email,
    html,
    from = "Hello it's <codeSender>",
    subject = 'Account verification',
  }: SendEmailArgs) {
    try {
      const transport = this.createTransport();

      await transport.sendMail({ from, to: email, subject, html });

      return true;
    } catch {
      return false;
    }
  },
};
