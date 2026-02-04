import { emailAdapter } from '../../core/adapters';

type SendConfirmationCodeArgs = { email: string; code: string };

export const emailRegistrationAdapter = {
  async sendConfirmationCode({ email, code }: SendConfirmationCodeArgs) {
    const html = `<div>
                      <h1>Please confirm your email</h1>
                      <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
                  </div>`;

    return emailAdapter.sendEmail({ email, html });
  },
  async resendConfirmationCode({ email, code }: SendConfirmationCodeArgs) {
    const html = `<div>
                      <h1>This is new confirmation code</h1>
                      <a href='https://some-front.com/confirm-registration?code=${code}'>complete registration</a>
                  </div>`;

    return emailAdapter.sendEmail({ email, html });
  },
};
