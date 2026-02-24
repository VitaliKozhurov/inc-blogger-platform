import { injectable, inject } from 'inversify';

import { EmailAdapter } from '../../core/adapters';

type SendConfirmationCodeArgs = { email: string; code: string };

@injectable()
export class EmailRegistrationAdapter {
  constructor(@inject(EmailAdapter) private emailAdapter: EmailAdapter) {}

  async sendConfirmationCode({ email, code }: SendConfirmationCodeArgs) {
    const html = `<div>
                      <h1>Please confirm your email</h1>
                      <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
                  </div>`;

    return this.emailAdapter.sendEmail({ email, html });
  }

  async resendConfirmationCode({ email, code }: SendConfirmationCodeArgs) {
    const html = `<div>
                      <h1>This is new confirmation code</h1>
                      <a href='https://somesite.com/confirm-registration?code=${code}'>complete registration</a>
                  </div>`;

    return this.emailAdapter.sendEmail({ email, html });
  }

  async sendPasswordRecoveryCode({ email, code }: SendConfirmationCodeArgs) {
    const html = `<div>
                     <h1>Password recovery</h1>
                      <p>To finish password recovery please follow the link below:
                          <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
                      </p>
                  </div>`;

    return this.emailAdapter.sendEmail({ email, html });
  }
}
