export const makeHospitalManagerSignUpTemplate = ({
  applicationName,
  signInLink,
  password,
  supportEmail,
}: {
  applicationName: string;
  signInLink: string;
  password: string;
  supportEmail: string;
}) => `
      <!doctype html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Добро пожаловать в ${applicationName} для менеджеров клиник!</title>
    </head>
    <body>
      Уважаемый(ая) администратор!
      <br>
      Благодарим вас за регистрацию в Resymon! Наша платформа разработана чтобы облегчить коммуникацию с пациентами и повысить эффективность работы вашей клиники.
      <br>
      <br>
       Если у вас возникнут вопросы, обратитесь в нашу службу технической поддержки, где Вас обязательно помогут: <a href="mailto:${supportEmail}">${supportEmail}</a>.
      <br>
      <br>
      Ссылка: ${signInLink}
      <br>
      Временный пароль: ${password}
      <br>
      <br>
      С уважением,
      <br>
      Команда ${applicationName}
    </body>
    </html>
      `;
