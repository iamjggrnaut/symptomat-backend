export const makeDoctorRecoverPasswordTemplate = ({
  applicationName,
  recoverPasswordLink,
  supportEmail,
}: {
  applicationName: string;
  recoverPasswordLink: string;
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
      Уважаемый доктор, 
      <br>
      Вы запросили восстановление пароля в системе ${applicationName}.
      <br>
      <br>
      Если восстановление пароля не требуется, проигнорируйте это письмо.
      <br>
      <br>
      Для восстановления доступа в личный кабинет перейдите по следующей ссылке:
      <br>
      ${recoverPasswordLink}
      <br>
      <br>
      При возникновении вопросов, пожалуйста, напишите в службу технической поддержки на ${supportEmail}
    </body>
    </html>
      `;
