export const makeCriticalIndicatorsTemplate = (
  medicalCardNumber: string,
  patientLink: string,
  supportEmail: string,
  questionsWithAnswers: string[],
) => `
    <!doctype html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Превышение критического уровня</title>
  </head>
  <body>
    Уважаемый доктор, 
    <br>
    у вашего пациента ${medicalCardNumber} превышен критический уровень следующих показателей:
    <br>
    <br>
    ${questionsWithAnswers.join('<br>')}
    <br>
    <br>
    Чтобы посмотреть все ответы пациента, перейдите по ссылке: ${patientLink}
    <br>
    <br>
    При возникновении вопросов, пожалуйста, напишите в службу технической поддержки на ${supportEmail}
  </body>
  </html>
    `;
