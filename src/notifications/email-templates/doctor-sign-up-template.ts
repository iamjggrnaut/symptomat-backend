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
      <title>Добро пожаловать в ${applicationName}, коллега!</title>
    </head>
    <body>
      Уважаемый(ая) доктор!
      <br>
      Благодарим вас за регистрацию в ${applicationName}! Наша платформа создана, чтобы помочь вам удаленно контролировать состояние пациентов и повышать эффективность терапии.
      <br>
      <br>
      Добавьте своих пациентов в систему, указав их данные (с соблюдением требований конфиденциальности) и получайте данные, поступающие от ваших пациентов, в удобном формате.
      <br>
      <br>
      Если у вас возникнут вопросы, обратитесь в нашу службу технической поддержки, где Вас обязательно помогут: <a href="mailto:${supportEmail}">${supportEmail}</a>.
      <br>
      <br>
      Для входа в личный кабинет перейдите по ссылке:
      <br>
      ${signInLink}
      <br>
      <br>
      С уважением,
      <br>
      Команда ${applicationName}
    </body>
    </html>
      `;
