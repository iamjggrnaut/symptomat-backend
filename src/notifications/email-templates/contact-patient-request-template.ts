export const makeContactPatientRequestTemplate = (
  medicalCardNumber: string,
  message: string,
  patientLink: string,
  supportEmail: string,
) => `
    <!doctype html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Связь с пациентом</title>
  </head>
  <body>
    Уважаемый доктор, 
    <br>
    пациент ${medicalCardNumber} просит Вас связаться с ним по следующей причине:
    <br>
    ${message}
    <br>
    <br>
    Для входа в личный кабинет и просмотра профиля пациента перейдите по ссылке:
    <br>
    ${patientLink}
    <br>
    <br>
    При возникновении вопросов, пожалуйста, напишите в службу технической поддержки на ${supportEmail}
  </body>
  </html>
    `;
