export const makeDoctorSignUpTemplate = ({
  applicationName,
  signInLink,
  supportEmail,
}: {
  applicationName: string;
  signInLink: string;
  supportEmail: string;
}) => `
      <!doctype html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Благодарим за регистрацию в ${applicationName}</title>
    </head>
    <body>
      Уважаемый доктор, 
      <br>
      Вы успешно зарегистрированы в ${applicationName}.
      <br>
      <br>
      Мы искренне надеемся, что использование ${applicationName} сделает Ваше взаимодействие с пациентами комфортным и эффективным.
      <br>
      <br>
      Для входа в личный кабинет перейдите по ссылке:
      <br>
      ${signInLink}
      <br>
      <br>
      При возникновении вопросов, пожалуйста, напишите в службу технической поддержки на ${supportEmail}
      <br>
      <br>
      Пожалуйста, не отвечайте на это письмо. Оно было создано автоматически.
    </body>
    </html>
      `;
