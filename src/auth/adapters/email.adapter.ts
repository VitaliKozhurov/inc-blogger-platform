import nodemailer from 'nodemailer';

import { SETTINGS } from '../../core/settings';

export const emailAdapter = {
  createTransport() {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SETTINGS.EMAIL_ADDRESS,
        pass: SETTINGS.APP_EMAIL_PASSWORD, // The 16-character App Password
      },
      // host: 'smtp.gmail.com',
      // port: 587,
      // secure: false,
      // requireTLS: true,
      // logger: true,
      // debug: true,
      // auth: {
      //   type: 'OAuth2',
      //   user: SETTINGS.EMAIL_ADDRESS,
      //   clientId: SETTINGS.GOOGLE_CLIENT_ID,
      //   clientSecret: SETTINGS.GOOGLE_CLIENT_SECRET,
      //   refreshToken: SETTINGS.GOOGLE_REFRESH_TOKEN,
      // },
    });

    return transport;
  },
  async sendEmail({ email, html }: { email: string; html: string }) {
    try {
      const transport = this.createTransport();

      const info = await transport.sendMail({
        from: '"Verification 🛡️" <codeSender>',
        to: email,
        subject: 'Account verification',
        html,
      });

      return !!info;
    } catch {
      return false;
    }
  },
  async sendRegistrationConfirmation({ email, code }: { email: string; code: string }) {
    const html = `<div>
                      <h1>Please confirm your email</h1>
                      <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
                  </div>`;

    return this.sendEmail({ email, html });
  },
  async resendRegistrationConfirmation({ email, code }: { email: string; code: string }) {
    const html = `<div>
                      <h1>This is new confirmation code</h1>
                      <a href='https://some-front.com/confirm-registration?code=${code}'>complete registration</a>
                  </div>`;

    return this.sendEmail({ email, html });
  },
};
