import { QuestionType } from 'src/questions/questions.types';
import { createQuestion } from './utils';

const diarrhea = createQuestion({
  title: 'Диарея',
  type: QuestionType.RADIO
});

const nausea = createQuestion({
  title: 'Тошнота',
  type: QuestionType.RADIO
});

const abdominalPain = createQuestion({
  title: 'Абдоминальная боль',
  indicators: {
    [QuestionType.SCALE]: {
      minValue: 0,
      maxValue: 10,
    }
  },
  type: QuestionType.SCALE,
});

const vomit = createQuestion({
  title: 'Рвота',
  type: QuestionType.RADIO,
});

const weakness = createQuestion({
  title: 'Слабость',
  type: QuestionType.RADIO,
});

const headache = createQuestion({
  title: 'Головная боль',
  indicators: {
    [QuestionType.SCALE]: {
      minValue: 0,
      maxValue: 10,
    }
  },
  type: QuestionType.SCALE,
});

const alopecia = createQuestion({
  title: 'Алопеция',
  type: QuestionType.RADIO,
});

const decreasedAppetite = createQuestion({
  title: 'Снижение аппетита',
  type: QuestionType.RADIO,
});

const infections = createQuestion({
  title: 'Инфекции',
  type: QuestionType.RADIO,
});

const cough = createQuestion({
  title: 'Кашель',
  type: QuestionType.RADIO,
});

const edema = createQuestion({
  title: 'Отеки',
  type: QuestionType.RADIO,
});

const redness = createQuestion({
  title: 'Покраснение',
  type: QuestionType.RADIO,
});

const increasedBloodPressure = createQuestion({
  title: 'Повышение артериального давления',
  type: QuestionType.PRESSURE,
});

const weight = createQuestion({
  title: 'Вес',
  type: QuestionType.WEIGHT,
});

const pulse = createQuestion({
  title: 'Пульс',
  type: QuestionType.PULSE,
});

const jointPain = createQuestion({
  title: 'Боль в суставах',
  type: QuestionType.RADIO,
});

const respiratoryInfections = createQuestion({
  title: 'Респираторные инфекции',
  type: QuestionType.RADIO,
});

const inflammationOfTheOralMucosa = createQuestion({
  title: 'Воспаление слизистой полости рта',
  type: QuestionType.RADIO,
});

const peripheralEdema = createQuestion({
  title: 'Периферические отеки',
  type: QuestionType.CHECKBOX,
});

const temperature = createQuestion({
  title: 'Температура',
  type: QuestionType.TEMPERATURE,
});

const itching = createQuestion({
  title: 'Зуд',
  type: QuestionType.RADIO,
});

const dizziness = createQuestion({
  title: 'Головокружение',
  type: QuestionType.RADIO,
});

const changeInTaste = createQuestion({
  title: 'Изменение вкуса',
  type: QuestionType.RADIO,
});

const musclePain = createQuestion({
  title: 'Мышечная боль',
  indicators: {
    [QuestionType.SCALE]: {
      minValue: 0,
      maxValue: 10,
    }
  },
  type: QuestionType.SCALE,
});

const tendencyToFormBruises = createQuestion({
  title: 'Склонность к образованию гематом',
  type: QuestionType.RADIO,
});

const constipation = createQuestion({
  title: 'Запор',
  type: QuestionType.RADIO,
});

const rash = createQuestion({
  title: 'Сыпь',
  type: QuestionType.RADIO,
});

const paronychia = createQuestion({
  title: 'Паронихия',
  type: QuestionType.RADIO,
});

const drySkin = createQuestion({
  title: 'Сухость кожи',
  type: QuestionType.RADIO,
});

const eyePain = createQuestion({
  title: 'Глазная боль',
  indicators: {
    [QuestionType.SCALE]: {
      minValue: 0,
      maxValue: 10,
    }
  },
  type: QuestionType.SCALE,
});

const cataract = createQuestion({
  title: 'Катаракта',
  type: QuestionType.RADIO,
});

const floaters = createQuestion({
  title: 'Флоатерс',
  type: QuestionType.RADIO,
});

const difficultySwallowing = createQuestion({
  title: 'Затруднение глотания',
  type: QuestionType.RADIO,
});

const urinaryTractInfections = createQuestion({
  title: 'Инфекции мочевыводящих путей',
  type: QuestionType.RADIO,
});

export const questions = {
  nausea,
  diarrhea,
  abdominalPain,
  vomit,
  weakness,
  headache,
  alopecia,
  decreasedAppetite,
  infections,
  cough,
  edema,
  redness,
  increasedBloodPressure,
  jointPain,
  respiratoryInfections,
  inflammationOfTheOralMucosa,
  peripheralEdema,
  temperature,
  itching,
  dizziness,
  changeInTaste,
  musclePain,
  tendencyToFormBruises,
  constipation,
  rash,
  paronychia,
  drySkin,
  eyePain,
  cataract,
  floaters,
  difficultySwallowing,
  urinaryTractInfections,
  weight,
  pulse,
};
