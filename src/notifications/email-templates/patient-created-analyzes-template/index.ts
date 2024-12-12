import { Language } from 'src/common/types/users.types';

import { makePatientCreatedAnalyzesTemplateDe } from './patient-created-analyzes-template-de';
import { makePatientCreatedAnalyzesTemplateEn } from './patient-created-analyzes-template-en';
import { makePatientCreatedAnalyzesTemplateKz } from './patient-created-analyzes-template-kz';
import { makePatientCreatedAnalyzesTemplateRu } from './patient-created-analyzes-template-ru';
import { MakeTemplateFn, MakeTemplateInput } from './types';

const mapping: Record<Language, MakeTemplateFn> = {
  [Language.DE]: makePatientCreatedAnalyzesTemplateDe,
  [Language.EN]: makePatientCreatedAnalyzesTemplateEn,
  [Language.KZ]: makePatientCreatedAnalyzesTemplateKz,
  [Language.RU]: makePatientCreatedAnalyzesTemplateRu,
};

export const makePatientCreatedAnalyzesTemplate = (input: MakeTemplateInput & { lang: Language }) => {
  const { lang, ...executeInput } = input;

  const execute = mapping[lang];
  if (!execute) {
    throw new Error(`Unknown template for "${lang}" language`);
  }

  return execute(executeInput);
};
