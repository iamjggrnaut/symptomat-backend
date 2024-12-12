export const makePatientSignUpTemplate = ({
  applicationName,
  appStoreLink,
  googlePlayLink,
  password,
  supportEmail,
}: {
  applicationName: string;
  appStoreLink: string;
  googlePlayLink: string;
  password: string;
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
      Уважаемый пациент, 
      <br>
      Вы успешно зарегистрированы в ${applicationName}.
      <br>
      <br>
      Мы искренне надеемся, что Ваше сотрудничество с врачом с помощью приложения ${applicationName} поможет Вам в лечении.
      <br>
      <br>
      Для начала работы, пожалуйста, загрузите на Ваше устройство приложение ${applicationName}, перейдя по ссылке:
      <br>
      AppStore: ${appStoreLink}
      <br>
      GooglePlay: ${googlePlayLink}
      <br>
      <br>
      Временный пароль для первого входа в приложение: ${password}
      <br>
      <br>
      При возникновении вопросов, пожалуйста, напишите в службу технической поддержки на ${supportEmail}
      <br>
      <br>
      Пожалуйста, не отвечайте на это письмо. Оно было создано автоматически.
    </body>
    </html>
      `;
