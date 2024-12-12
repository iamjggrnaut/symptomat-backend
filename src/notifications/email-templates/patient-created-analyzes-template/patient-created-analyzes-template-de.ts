import { MakeTemplateInput } from './types';

export const makePatientCreatedAnalyzesTemplateDe = (input: MakeTemplateInput) => `
<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Загружены новые анализы"</title>
</head>
<body>
  Уважаемый доктор,
  <br>
  пациент #${input.patientMedicalCardNumber} загрузил новые анализы
  <br>
  <br>
  Для входа в личный кабинет и просмотра профиля пациента перейдите по ссылке: ${input.analyzesLink}
  <br>
  <br>
  При возникновении вопросов, пожалуйста, напишите в службу технической поддержки на ${input.supportEmail}
</body>
</html>
`;
