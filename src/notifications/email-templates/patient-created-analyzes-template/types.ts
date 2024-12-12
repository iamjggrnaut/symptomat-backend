export type MakeTemplateInput = {
  patientMedicalCardNumber: string;
  analyzesLink: string;
  supportEmail: string;
};

export type MakeTemplateFn = (MakeTemplateParams) => string;
