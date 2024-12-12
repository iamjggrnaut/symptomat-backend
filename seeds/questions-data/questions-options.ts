import { questions } from "./questions";
import { createQuestionOptions } from "./utils";


const diarrheaQuestionOptions = createQuestionOptions(
  questions.diarrhea,
  [
    'Не было',
    'До 4-х раз в сутки',
    '4-7 раз в сутки',
    '7 и более раз в сутки',
  ]
);

const nauseaQuestionOptions = createQuestionOptions(
  questions.nausea,
  [
    'Не было',
    'Отсутствует аппетит',
    'Прием пищи существенно ограничен без снижения веса',
    'Прием пищи невозможен',
  ]
);

const vomitQuestionOptions = createQuestionOptions(
  questions.vomit,
  [
    'Не было',
    '1-2 раза в сутки',
    '3-5 раз в сутки',
    '6 раз и более',
  ]
);

const weaknessQuestionOptions = createQuestionOptions(
  questions.weakness,
  [
    'Не было',
    'Только при нагрузке',
    'В покое, ограничение повседневной активности',
    'В покое, невозможность себя обслуживать',
  ]
);

const alopeciaQuestionOptions = createQuestionOptions(
  questions.alopecia,
  [
    'Не было',
    'Есть, прическа сохранена',
    'Выраженная потеря волос',
  ]
);

const decreasedAppetiteQuestionOptions = createQuestionOptions(
  questions.decreasedAppetite,
  [
    'Не было',
    'Отсутствие аппетита',
    'Отсутствие аппетита и уменьшение приема пищи',
    'Отсутствие аппетита и снижение веса',
  ]
);

const infectionsQuestionOptions = createQuestionOptions(
  questions.infections,
  [
    'Не было',
    'Прием антибиотиков внутрь',
    'Прием антибиотиков внутривенно',
    'Госпитализация',
  ]
);

const coughQuestionOptions = createQuestionOptions(
  questions.cough,
  [
    'Не было',
    'Слабый',
    'Средний',
    'Сильный',
  ]
);

const edemaQuestionOptions = createQuestionOptions(
  questions.edema,
  [
    'Не было',
    'Небольшие',
    'Выраженные',
  ]
);

const rednessQuestionOptions = createQuestionOptions(
  questions.redness,
  [
    'Не было',
    'Было, не сопровождалось тахикардией',
    'Было, сопровождалось тахикардией',
  ]
);

const jointPainQuestionOptions = createQuestionOptions(
  questions.jointPain,
  [
    'Не было',
    'Слабая',
    'Средняя, ограничение повседневной активности',
    'Сильная, невозможность себя обслуживать',
  ]
);

const respiratoryInfectionsQuestionOptions = createQuestionOptions(
  questions.respiratoryInfections,
  [
    'Не было',
    'Прием антибиотиков внутрь',
    'Прием антибиотиков внутривенно',
    'Госпитализация',
  ]
);

const inflammationOfTheOralMucosaQuestionOptions = createQuestionOptions(
  questions.inflammationOfTheOralMucosa,
  [
    'Не было',
    'Было, не мешал приему пищи',
    'Было, мешал приему пищи',
  ]
);

const peripheralEdemaQuestionOptions = createQuestionOptions(
  questions.peripheralEdema,
  [
    'Глаза',
    'Лицо',
    'Кисти рук',
    'Руки',
    'Стопы',
    'Ноги',
    'Туловище',
    'Грудь',
  ]
);

const itchingQuestionOptions = createQuestionOptions(
  questions.itching,
  [
    'Не было',
    'Местный, в одной части тела',
    'Периодический генерализованный',
    'Постоянный генерализованный, мешает сну',
  ]
);

const dizzinessQuestionOptions = createQuestionOptions(
  questions.dizziness,
  [
    'Не было',
    'Легкое',
    'Среднее',
    'Тяжелое',
  ]
);

const changeInTasteQuestionOptions = createQuestionOptions(
  questions.changeInTaste,
  [
    'Не было',
    'Было, не мешало приему пищи',
    'Было, мешало приему пищи',
  ]
);

const tendencyToFormBruisesQuestionOptions = createQuestionOptions(
  questions.tendencyToFormBruises,
  [
    'Не было',
    'Локализованная',
    'Генерализованная',
  ]
);

const constipationQuestionOptions = createQuestionOptions(
  questions.constipation,
  [
    'Не было',
    'Однократное применение антизапорных средств',
    'Регулярное использование средств',
    'Госпитализация',
  ]
);

const rashQuestionOptions = createQuestionOptions(
  questions.rash,
  [
    'Не было',
    'Поражение < 10% поверхности тела',
    'Поражение 10-30% поверхности тела',
    'Поражение > 30% поверхности тела',
  ]
);

const paronychiaQuestionOptions = createQuestionOptions(
  questions.paronychia,
  [
    'Не было',
    'Отек или покраснение',
    'Отек или покраснение, сопровождающиеся болью',
  ]
);

const drySkinQuestionOptions = createQuestionOptions(
  questions.drySkin,
  [
    'Не было',
    '< 10% поверхности тела',
    '10-30% поверхности тела',
    '> 30% поверхности тела',
  ]
);

const cataractQuestionOptions = createQuestionOptions(
  questions.cataract,
  [
    'Не было',
    'Незначительное снижение остроты зрения',
    'Выраженное снижение остроты зрения',
  ]
);

const floatersQuestionOptions = createQuestionOptions(
  questions.floaters,
  [
    'Не было',
    'Не вызвали ограничение повседневной активности',
    'Ограничение повседневной активности',
  ]
);

const difficultySwallowingQuestionOptions = createQuestionOptions(
  questions.difficultySwallowing,
  [
    'Не было',
    'Не мешало приему пищи',
    'Прием пищи ограничен',
    'Прием пищи невозможен',
  ]
);

const urinaryTractInfectionsQuestionOptions = createQuestionOptions(
  questions.urinaryTractInfections,
  [
    'Не было',
    'Прием антибиотиков внутрь',
    'Прием антибиотиков внутривенно',
    'Госпитализация',
  ]
);

const flatten = <T>(arr: T[][]) => arr.reduce((acc, item) => [...acc, ...item], []);

export const questionsOptions = flatten([
  diarrheaQuestionOptions,
  nauseaQuestionOptions,
  vomitQuestionOptions,
  weaknessQuestionOptions,
  alopeciaQuestionOptions,
  decreasedAppetiteQuestionOptions,
  infectionsQuestionOptions,
  coughQuestionOptions,
  edemaQuestionOptions,
  rednessQuestionOptions,
  jointPainQuestionOptions,
  respiratoryInfectionsQuestionOptions,
  inflammationOfTheOralMucosaQuestionOptions,
  peripheralEdemaQuestionOptions,
  itchingQuestionOptions,
  dizzinessQuestionOptions,
  changeInTasteQuestionOptions,
  tendencyToFormBruisesQuestionOptions,
  constipationQuestionOptions,
  rashQuestionOptions,
  paronychiaQuestionOptions,
  drySkinQuestionOptions,
  cataractQuestionOptions,
  floatersQuestionOptions,
  difficultySwallowingQuestionOptions,
  urinaryTractInfectionsQuestionOptions,
]);
