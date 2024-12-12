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
      <title>Благодарим за регистрацию в ${applicationName}</title>
    </head>
    <body>
      Уважаемый администратор, 
      <br>
      благодарим Вас за регистрацию в системе ${applicationName}.
      <br>
      <br>
      Для входа в Личный кабинет перейдите по ссылке и используйте приведенный ниже пароль.
      <br>
      <br>
      Ссылка: ${signInLink}
      <br>
      Пароль: ${password}
      <br>
      <br>
      При возникновении вопросов, пожалуйста, напишите в службу технической поддержки на ${supportEmail}
      <br>
      <br>
      Пожалуйста, не отвечайте на это письмо. Оно было создано автоматически.
    </body>
    </html>
      `;
