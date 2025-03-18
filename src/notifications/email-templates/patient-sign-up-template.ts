export const makePatientSignUpTemplate = ({
  firstname,
  lastname,
  applicationName,
  appStoreLink,
  googlePlayLink,
  password,
  supportEmail,
}: {
  firstname: string;
  lastname: string;
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
      <title>Добро пожаловать в ${applicationName}!</title>
    </head>
    <body>
      Здравствуйте, ${firstname} ${lastname}!
      <br>
      <br>
      Спасибо, что присоединились к ${applicationName}! Мы рады помочь вам в управлении терапией и повышении качества жизни.
      <br>
      <br>
      Пожалуйста, заполните свой профиль, указав необходимую информацию о состоянии здоровья.
      <br>
      <br>
      Не стесняйтесь обращаться к нашей службе поддержки, если у вас возникнут вопросы: <a href="mailto:${supportEmail}">${supportEmail}</a>.
      <br>
      <br>
      Мы верим, что ${applicationName} поможет вам чувствовать себя увереннее и держать лечение под контролем.
      <br>
      <br>
      Временный пароль: ${password}
      <br>
      <br>
      Android:
      <br>
      <ul>
      <li>
      GooglePlay: <a href="https://play.google.com/store/apps/details?id=medico.app"> Resymon - Apps on Google Play</a>
      </li>
      <li>
      RuStore: <a href="https://www.rustore.ru/catalog/app/medico.app">Resymon в каталоге RuStore @RuStore</a>
      </li>
      </ul>
      <br>
      AppStore: <a href="https://apps.apple.com/us/app/resymon/id1601949347">Resymon @App Store</a>
      <br>
      <br>
      С уважением,
      <br>
      Команда ${applicationName}
    </body>
    </html>
      `;
