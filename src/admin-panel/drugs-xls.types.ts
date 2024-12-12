export type XlsxValue = string | number;

export type XlsxRaw = XlsxValue[];

export type CategoryToQuestion = {
  categoryName: string;
  questionName: string;
};

export type XlsxQuestionInfo = {
  name: XlsxValue;
  category: XlsxValue;
  type: XlsxValue;
  questionAnswers: XlsxRaw;
};

export type QuestionToDrug = {
  drugIndex: number;
  questionIndex: number;
  questionId: string | null;
};
