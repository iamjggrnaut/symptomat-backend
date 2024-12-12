export const makePatientRecoverPasswordTemplate = ({
  applicationName,
  recoveryCode,
  supportEmail,
}: {
  applicationName: string;
  recoveryCode: string;
  supportEmail: string;
}) => `
      <!doctype html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Восстановление доступа</title>
    </head>
    <body>
      Уважаемый пациент, 
      <br>
      Вы запросили восстановление пароля в системе ${applicationName}.
      <br>
      <br>
      Если восстановление пароля не требуется, проигнорируйте это письмо.
      <br>
      <br>
      Для восстановления доступа в личный кабинет введите указанный ниже код в приложении ${applicationName}.
      <br>
      <br>
      Код: ${recoveryCode}
      <br>
      <br>
      При возникновении вопросов, пожалуйста, напишите в службу технической поддержки на ${supportEmail}
    </body>
    </html>
      `;
