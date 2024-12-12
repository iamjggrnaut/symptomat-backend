import { drugs } from "./drugs";
import { questions } from "./questions";
import { createDrugsQuestions, DeepPartialDrugsQuestions } from "./utils";

const abemaciclibDrugQuestions = createDrugsQuestions({
  drug: drugs.abemaciclib,
  questions: [
    questions.diarrhea,
    questions.nausea,
    questions.abdominalPain,
    questions.vomit,
    questions.weakness,
    questions.headache,
    questions.alopecia,
    questions.decreasedAppetite,
    questions.infections
  ],
});

const abirateroneDrugQuestions = createDrugsQuestions({
  drug: drugs.abiraterone,
  questions: [
    questions.diarrhea,
    questions.nausea,
    questions.vomit,
    questions.weakness,
    questions.headache,
    questions.cough,
    questions.edema,
    questions.redness,
    questions.jointPain,
    questions.respiratoryInfections,
  ],
});

const abemaciclibFulvestrantDrugQuestions = createDrugsQuestions({
  drug: drugs.abemaciclibFulvestrant,
  questions: [
    questions.diarrhea,
    questions.nausea,
    questions.abdominalPain,
    questions.vomit,
    questions.inflammationOfTheOralMucosa,
    questions.weakness,
    questions.peripheralEdema,
    questions.temperature,
    questions.decreasedAppetite,
    questions.cough,
    questions.itching,
    questions.headache,
    questions.dizziness,
    questions.changeInTaste,
    questions.alopecia,
  ],
});

const akalabrutinibDrugQuestions = createDrugsQuestions({
  drug: drugs.akalabrutinib,
  questions: [
    questions.diarrhea,
    questions.weakness,
    questions.headache,
    questions.musclePain,
    questions.tendencyToFormBruises,
  ],
});

const alektinibDrugQuestions = createDrugsQuestions({
  drug: drugs.alektinib,
  questions: [
    questions.constipation,
    questions.weakness,
    questions.edema,
    questions.musclePain,
  ],
});

const afatinibDrugQuestions = createDrugsQuestions({
  drug: drugs.afatinib,
  questions: [
    questions.diarrhea,
    questions.nausea,
    questions.vomit,
    questions.inflammationOfTheOralMucosa,
    questions.decreasedAppetite,
    questions.rash,
    questions.paronychia,
    questions.drySkin,
    questions.itching,
  ],
});

const afliberceptDrugQuestions = createDrugsQuestions({
  drug: drugs.aflibercept,
  questions: [
    questions.eyePain,
    questions.cataract,
    questions.floaters,
  ],
});

const dactinomycinDrugQuestions = createDrugsQuestions({
  drug: drugs.dactinomycin,
  questions: [
    questions.nausea,
    questions.vomit,
    questions.infections,
    questions.alopecia,
    questions.difficultySwallowing,
    questions.weakness,
    questions.temperature,
  ],
});

const durvalumabDrugQuestions = createDrugsQuestions({
  drug: drugs.durvalumab,
  questions: [
    questions.nausea,
    questions.constipation,
    questions.weakness,
    questions.peripheralEdema,
    questions.musclePain,
    questions.decreasedAppetite,
    questions.urinaryTractInfections,
  ],
});

const clofarabineDrugQuestions = createDrugsQuestions({
  drug: drugs.clofarabine,
  questions: [
    questions.diarrhea,
    questions.nausea,
    questions.vomit,
    questions.weakness,
    questions.temperature,
    questions.headache,
    questions.itching,
    questions.redness,
  ],
});

export const drugsQuestions: DeepPartialDrugsQuestions[] = [
  ...abemaciclibDrugQuestions,
  ...abirateroneDrugQuestions,
  ...abemaciclibFulvestrantDrugQuestions,
  ...akalabrutinibDrugQuestions,
  ...alektinibDrugQuestions,
  ...afatinibDrugQuestions,
  ...afliberceptDrugQuestions,
  ...dactinomycinDrugQuestions,
  ...durvalumabDrugQuestions,
  ...clofarabineDrugQuestions,
];