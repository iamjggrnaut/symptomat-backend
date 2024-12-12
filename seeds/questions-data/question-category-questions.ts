import { questionCategories } from "./question-categories";
import { questions } from "./questions";
import { createQuestionCategoryQuestions } from "./utils";

const centralNervousSystem = createQuestionCategoryQuestions(
    questions.abdominalPain,
    questionCategories.lymphaticSystem,
);

const peripheralNervousSystem = createQuestionCategoryQuestions(
    questions.changeInTaste,
    questionCategories.locomotorApparatus,
  );

const senseOrgans = createQuestionCategoryQuestions(
    questions.alopecia,
    questionCategories.respiratorySystem,
);

const cataract = createQuestionCategoryQuestions(
    questions.cataract,
    questionCategories.urinarySystem,
);

const drySkin = createQuestionCategoryQuestions(
    questions.drySkin,
    questionCategories.skinMucous,
);

const redness = createQuestionCategoryQuestions(
    questions.redness,
    questionCategories.maleReproductiveSystem,
);

export const questionCategoriesQuestions = {
    centralNervousSystem,
    peripheralNervousSystem,
    senseOrgans,
    cataract,
    drySkin,
    redness
}