export const makePatientAnswerQueryTemplate = ({
  firstname,
  lastname,
  applicationName,
  appStoreLink,
  googlePlayLink,
  supportEmail,
}: {
  firstname: string;
  lastname: string;
  applicationName: string;
  appStoreLink: string;
  googlePlayLink: string;
  supportEmail: string;
}) => `
        <!doctype html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Активный опрос!</title>
      </head>
      <body>
        Здравствуйте, (Имя пользователя)!
        <br>
        <br>
        У Вас имеется активный опрос!
        <br>
        Пожалуйста, перейдите в приложение и заполните его. Так врач всегда будет в курсе вашего состояния.
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
