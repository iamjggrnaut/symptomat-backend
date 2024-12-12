import { QuestionType } from './questions.types';

export const TemperatureAndPressureIndicators = {
  [QuestionType.TEMPERATURE]: {
    minValue: 33,
    maxValue: 44,
  },
  [QuestionType.PRESSURE]: {
    upperMinValue: 100,
    upperMaxValue: 200,
    lowerMinValue: 50,
    lowerMaxValue: 150,
  },
};
